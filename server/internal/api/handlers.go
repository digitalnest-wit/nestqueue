package api

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/digitalnest-wit/nestqueue/internal/models"
	"github.com/digitalnest-wit/nestqueue/internal/storage"
	"go.uber.org/zap"
)

var (
	errInternal            = errors.New("an internal server error occurred")
	_databaseTimeoutPolicy = 8 * time.Second
)

// TicketHandler handles ticket-related API requests
type TicketHandler struct {
	store  *storage.TicketStore
	logger *zap.Logger
}

// NewTicketHandler creates a new ticket handler
func NewTicketHandler(store *storage.TicketStore, logger *zap.Logger) *TicketHandler {
	return &TicketHandler{
		store:  store,
		logger: logger.Named("handler"),
	}
}

// Logger simply returns this handler's logger. This method is implemented to
// satisfy logHandler.
func (h *TicketHandler) Logger() *zap.Logger {
	return h.logger
}

// RegisterRoutes registers the ticket API routes
func (h *TicketHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/v1/tickets", h.handleCreateTicket)
	mux.HandleFunc("GET /api/v1/tickets", h.handleGetTickets)
	mux.HandleFunc("GET /api/v1/tickets/{id}", h.handleGetTicket)
	mux.HandleFunc("PUT /api/v1/tickets/{id}", h.handleUpdateTicket)
	mux.HandleFunc("POST /api/v1/tickets/{id}/complete", h.handleCompleteTicket)
	mux.HandleFunc("DELETE /api/v1/tickets/{id}", h.handleDeleteTicket)
}

// handleCreateTicket handles creating a new ticket
func (h *TicketHandler) handleCreateTicket(w http.ResponseWriter, r *http.Request) {
	var (
		newTicket models.Ticket
		sugar     = h.logger.Sugar()
		response  map[string]any
	)

	if err := decodeInto(r.Body, &newTicket); err != nil {
		e := fmt.Errorf("bad request: %w", err)
		sugar.Debug(e)
		http.Error(w, e.Error(), http.StatusBadRequest)

		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), _databaseTimeoutPolicy)
	defer cancel()

	id, err := h.store.CreateTicket(ctx, newTicket)
	if err != nil {
		sugar.Error(err)
		http.Error(w, errInternal.Error(), http.StatusInternalServerError)

		return
	}

	w.Header().Set("Content-Type", "application.json")
	w.WriteHeader(http.StatusCreated)

	response = map[string]any{"id": id}

	encodeJSON(h, w, response)
}

// handleGetTickets handles listing all tickets with optional query filtering
func (h *TicketHandler) handleGetTickets(w http.ResponseWriter, r *http.Request) {
	var (
		query   = r.URL.Query().Get("q")
		results []models.Ticket
		sugar   = h.logger.Sugar()
	)

	ctx, cancel := context.WithTimeout(context.Background(), _databaseTimeoutPolicy)
	defer cancel()

	results, err := h.store.FindTickets(ctx, query)
	if err != nil {
		sugar.Error(err)
		http.Error(w, errInternal.Error(), http.StatusInternalServerError)

		return
	}

	w.Header().Set("Content-Type", "application/json")

	// If no results were returned and query is non-empty, respond with not found
	if len(results) == 0 && query != "" {
		sugar.Debugw("no tickets found", "query", query)
		w.WriteHeader(http.StatusNotFound)
	}

	response := map[string]any{
		"count":   len(results),
		"tickets": results,
	}

	encodeJSON(h, w, response)
}

// handleGetTicket handles retrieving a ticket by ID
func (h *TicketHandler) handleGetTicket(w http.ResponseWriter, r *http.Request) {
	var (
		ticketId = r.PathValue("id")
		sugar    = h.logger.Sugar()
	)

	ctx, cancel := context.WithTimeout(context.Background(), _databaseTimeoutPolicy)
	defer cancel()

	ticket, err := h.store.FindTicket(ctx, ticketId)

	if err != nil {
		switch {
		case errors.Is(err, storage.ErrTicketNotFound):
			sugar.Debug(err.Error())
			http.Error(w, err.Error(), http.StatusNotFound)

			return
		default:
			sugar.Error(err)
			http.Error(w, errInternal.Error(), http.StatusInternalServerError)

			return
		}
	}

	w.Header().Set("Content-Type", "application/json")

	encodeJSON(h, w, ticket)
}

// handleUpdateTicket handles updating an existing ticket
func (h *TicketHandler) handleUpdateTicket(w http.ResponseWriter, r *http.Request) {
	var (
		ticketId = r.PathValue("id")
		updates  = make(map[string]any, 10)
		sugar    = h.logger.Sugar()
	)

	if err := decodeInto(r.Body, &updates); err != nil {
		sugar.Error(err)
		http.Error(w, errInternal.Error(), http.StatusInternalServerError)

		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), _databaseTimeoutPolicy)
	defer cancel()

	ticket, err := h.store.UpdateTicket(ctx, ticketId, updates)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrTicketNotFound):
			sugar.Debug(err)
			http.Error(w, err.Error(), http.StatusNotFound)

			return
		default:
			sugar.Error(err)
			http.Error(w, errInternal.Error(), http.StatusInternalServerError)

			return
		}
	}

	w.WriteHeader(http.StatusOK)

	encodeJSON(h, w, ticket)
}

// handleCompleteTicket handles marking a ticket as completed (closed)
func (h *TicketHandler) handleCompleteTicket(w http.ResponseWriter, r *http.Request) {
	var (
		ticketId = r.PathValue("id")
		updates  = map[string]any{
			"status":    "Closed",
			"updatedAt": time.Now(),
		}
		sugar = h.logger.Sugar()
	)

	ctx, cancel := context.WithTimeout(context.Background(), _databaseTimeoutPolicy)
	defer cancel()

	ticket, err := h.store.UpdateTicket(ctx, ticketId, updates)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrTicketNotFound):
			sugar.Debug(err)
			http.Error(w, err.Error(), http.StatusNotFound)

			return
		default:
			sugar.Error(err)
			http.Error(w, errInternal.Error(), http.StatusInternalServerError)

			return
		}
	}

	w.WriteHeader(http.StatusOK)

	encodeJSON(h, w, ticket)
}

// handleDeleteTicket handles deleting a ticket
func (h *TicketHandler) handleDeleteTicket(w http.ResponseWriter, r *http.Request) {
	var (
		ticketId = r.PathValue("id")
		sugar    = h.logger.Sugar()
	)

	ctx, cancel := context.WithTimeout(context.Background(), _databaseTimeoutPolicy)
	defer cancel()

	if err := h.store.DeleteTicket(ctx, ticketId); err != nil {
		switch {
		case errors.Is(err, storage.ErrTicketNotFound):
			sugar.Debugw(err.Error())
			http.Error(w, err.Error(), http.StatusNotFound)

			return
		default:
			sugar.Error(err)
			http.Error(w, errInternal.Error(), http.StatusInternalServerError)

			return
		}
	}

	w.WriteHeader(http.StatusNoContent)
}
