package storage

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/digitalnest-wit/nestqueue/internal/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
	"go.uber.org/zap"
)

var (
	ErrTicketNotFound = errors.New("ticket not found")
)

// TicketStore provides CRUD operations for tickets stored in a Mongo DB collection
type TicketStore struct {
	collection *mongo.Collection
	log        *zap.Logger
}

// NewTicketStore creates a new TicketStore with a Mongo DB client config and
// logger. If client cannot be pinged, an error is returned.
func NewTicketStore(ctx context.Context, client *mongo.Client, logger *zap.Logger) (*TicketStore, error) {
	const (
		database   = "nq_tickets"
		collection = "tickets"
	)

	var sugar = logger.Sugar()

	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		sugar.Errorw("failed to connect to Mongo DB cluster", "error", err)
		return nil, err
	}

	sugar.Debugw("connected to Mongo DB cluster", "database", database, "collection", collection)

	return &TicketStore{
		collection: client.Database(database).Collection(collection),
		log:        logger.Named("storage"),
	}, nil
}

// CreateTicket adds a new ticket to the store
func (s *TicketStore) CreateTicket(ctx context.Context, ticket models.Ticket) (id string, err error) {
	var (
		sugar = s.log.Sugar()
		now   = time.Now()
		doc   = bson.D{
			{Key: "title", Value: ticket.Title},
			{Key: "description", Value: ticket.Description},
			{Key: "site", Value: ticket.Site},
			{Key: "category", Value: ticket.Category},
			{Key: "assignedTo", Value: ticket.AssignedTo},
			{Key: "createdBy", Value: ticket.CreatedBy},
			{Key: "priority", Value: ticket.Priority},
			{Key: "status", Value: ticket.Status},
			{Key: "createdOn", Value: now},
			{Key: "updatedAt", Value: now},
		}
	)

	// Add deadline if it's provided
	if ticket.Deadline != nil {
		doc = append(doc, bson.E{Key: "deadline", Value: *ticket.Deadline})
	}

	res, err := s.collection.InsertOne(ctx, doc)
	if err != nil {
		return "", err
	}

	insertedId, ok := res.InsertedID.(bson.ObjectID)
	if !ok {
		return "", errors.New("failed to decode inserted ID into ObjectID")
	}

	sugar.Debugw("created new ticket", "id", insertedId.Hex())

	return insertedId.Hex(), err
}

// FindTicket finds a ticket by its ID
func (s *TicketStore) FindTicket(ctx context.Context, id string) (*models.Ticket, error) {
	var (
		ticket *models.Ticket
		filter bson.D
		sugar  = s.log.Sugar()
	)

	objectId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		sugar.Debugw("id provided is not a valid ObjectID", err)
		return nil, ErrTicketNotFound
	}

	filter = bson.D{{Key: "_id", Value: objectId}}
	res := s.collection.FindOne(ctx, filter)

	if err := res.Err(); err != nil {
		switch {
		case errors.Is(err, mongo.ErrNoDocuments):
			sugar.Debugw("ticket not found", "ticket.id", id)
			return nil, ErrTicketNotFound

		default:
			sugar.Error(err)
			return nil, err
		}
	}

	sugar.Debugw("found ticket", "ticket.id", id)

	if err := res.Decode(&ticket); err != nil {
		sugar.Error(err)
		return nil, err
	}

	ticket.ID = objectId.Hex()

	return ticket, nil
}

// UpdateTicket updates an existing ticket
func (s *TicketStore) UpdateTicket(ctx context.Context, id string, updates map[string]any) (*models.Ticket, error) {
	var (
		updatesDoc = bson.D{}
		sugar      = s.log.Sugar()
	)

	objectId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		sugar.Debugw("bad id provided", err)
		return nil, err
	}

	for k, v := range updates {
		sugar.Debugw("update field type", "key", k, "type", fmt.Sprintf("%T", v), "value", v)
	}

	// Populate updatesDoc based on the fields provided in updates

	if title, ok := updates["title"].(string); ok {
		updatesDoc = append(updatesDoc, bson.E{Key: "title", Value: title})
	}

	if description, ok := updates["description"].(string); ok {
		updatesDoc = append(updatesDoc, bson.E{Key: "description", Value: description})
	}

	if site, ok := updates["site"].(string); ok {
		updatesDoc = append(updatesDoc, bson.E{Key: "site", Value: site})
	}

	if category, ok := updates["category"].(string); ok {
		updatesDoc = append(updatesDoc, bson.E{Key: "category", Value: category})
	}

	if assignedTo, ok := updates["assignedTo"].(string); ok {
		updatesDoc = append(updatesDoc, bson.E{Key: "assignedTo", Value: assignedTo})
	}

	if priority, ok := updates["priority"].(float64); ok {
		updatesDoc = append(updatesDoc, bson.E{Key: "priority", Value: int(priority)})
	}

	if status, ok := updates["status"].(string); ok {
		updatesDoc = append(updatesDoc, bson.E{Key: "status", Value: status})
	}

	if deadline, ok := updates["deadline"].(string); ok {
		var parsedDeadline time.Time
		var err error

		// Try datetime-local format first (YYYY-MM-DDTHH:MM)
		if parsedDeadline, err = time.Parse("2006-01-02T15:04", deadline); err != nil {
			// Try date-only format (YYYY-MM-DD)
			if parsedDeadline, err = time.Parse("2006-01-02", deadline); err != nil {
				// Try RFC3339 format as fallback
				if parsedDeadline, err = time.Parse(time.RFC3339, deadline); err != nil {
					sugar.Debugw("failed to parse deadline", "error", err, "value", deadline)
					return nil, err
				}
			}
		}

		updatesDoc = append(updatesDoc, bson.E{Key: "deadline", Value: parsedDeadline})
	}

	if len(updates) > 0 {
		updatesDoc = append(updatesDoc, bson.E{Key: "updatedAt", Value: time.Now()})
	}

	_, err = s.collection.UpdateByID(ctx, objectId, bson.D{{Key: "$set", Value: updatesDoc}})
	if err != nil {
		sugar.Error(err)
		return nil, err
	}

	updatedTicket, err := s.FindTicket(ctx, id)
	if err != nil {
		return nil, err
	}

	sugar.Debugw("ticket updated", "ticket.id", id, "updates", len(updates))

	return updatedTicket, nil
}

// DeleteTicket removes a ticket from the store
func (s *TicketStore) DeleteTicket(ctx context.Context, id string) error {
	var (
		filter bson.D
		sugar  = s.log.Sugar()
	)

	objectId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		sugar.Debugw("bad id provided", err)
		return err
	}

	filter = append(filter, bson.E{Key: "_id", Value: objectId})

	res := s.collection.FindOneAndDelete(ctx, filter)

	if err := res.Err(); err != nil {
		switch {
		case errors.Is(err, mongo.ErrNoDocuments):
			sugar.Debugw("ticket not found", "ticket.id", id)
			return ErrTicketNotFound

		default:
			sugar.Error(err)
			return err
		}
	}

	sugar.Debugw("deleted ticket", "ticket.id", id)

	return nil
}

// FindTickets returns all tickets, optionally filtered by a query. The query
// matches against a ticket's title and description.
func (s *TicketStore) FindTickets(ctx context.Context, query string) ([]models.Ticket, error) {
	var (
		sugar   = s.log.Sugar()
		results []models.Ticket
		filter  = bson.D{}
	)

	// Build the query filter, if provided
	if query != "" {
		filter = bson.D{
			{Key: "$or", Value: []bson.D{
				{{Key: "title", Value: bson.D{
					{Key: "$regex", Value: query},
					{Key: "$options", Value: "i"},
				}}},
				{{Key: "description", Value: bson.D{
					{Key: "$regex", Value: query},
					{Key: "$options", Value: "i"},
				}}},
			}},
		}
	}

	cursor, err := s.collection.Find(ctx, filter)
	if err != nil {
		sugar.Error(err)
		return nil, err
	}

	results = []models.Ticket{}

	for cursor.Next(ctx) {
		var ticket models.Ticket

		if err := cursor.Decode(&ticket); err != nil {
			sugar.Error(err)
			return nil, err
		}

		results = append(results, ticket)
	}

	sugar.Debugw("retreived tickets", "count", len(results), "query", query)

	return results, nil
}
