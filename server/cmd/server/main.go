package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/digitalnest-wit/nestqueue/internal/api"
	"github.com/digitalnest-wit/nestqueue/internal/storage"
	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

var (
	_serverPort = flag.Int("port", 3000, "the port to listen to")
)

func main() {
	flag.Parse()

	// Configure the logger
	logger, err := configureLogger()
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to configure logger: %s\n", err)
		os.Exit(1)
	}

	defer syncLogger(logger)

	if err := godotenv.Load(); err != nil {
		logger.Sugar().Warn("failed to load environment file", "error", err)
	}

	// Configure the Mongo DB client connection
	client, err := configureMongoClient()
	if err != nil {
		logger.Sugar().Fatalw("failed to connect to mongo cluster", "error", err)
	}

	defer disconnectClient(context.Background(), client, logger)

	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Create a ticket storage solution
	store, err := storage.NewTicketStore(ctx, client, logger)
	if err != nil {
		logger.Sugar().Fatal(err)
	}

	var (
		ticketHandler = api.NewTicketHandler(store, logger)
		mux           = http.NewServeMux()
	)

	ticketHandler.RegisterRoutes(mux)

	// Wrap mux with global-level middleware
	handler := corsMiddleware(logRequestsMiddleware(mux, logger))

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", *_serverPort),
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Start the server with graceful error handling
	runServer(server, logger)
}

func runServer(server *http.Server, logger *zap.Logger) {
	var (
		sugar         = logger.Sugar()
		interruptChan = make(chan os.Signal, 1)
		serverErrChan = make(chan error, 1)
	)

	sugar.Infof("server started on port %d", *_serverPort)

	// Relay interrupt signals to interruptChan
	signal.Notify(interruptChan, os.Interrupt, syscall.SIGTERM)

	run := func() {
		// ListenAndServe will always return a non-nil error
		err := server.ListenAndServe()

		serverErrChan <- err
		close(serverErrChan)
	}

	go run()

	// Block until either the server is interrupted or receives an error
	select {
	case <-interruptChan:
		sugar.Info("server stopped")
		os.Exit(0)
	case err := <-serverErrChan:
		sugar.Errorf("server received an error: %s", err)
		os.Exit(1)
	}
}
