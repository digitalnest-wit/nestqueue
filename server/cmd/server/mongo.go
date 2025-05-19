package main

import (
	"context"
	"errors"
	"os"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.uber.org/zap"
)

// configureMongoClient sets up a Mongo DB client and calls Connect to connect
// to the cluster
func configureMongoClient() (*mongo.Client, error) {
	uri, ok := os.LookupEnv("MONGO_URI")
	if !ok {
		return nil, errors.New("expected MONGO_URI variable in environment")
	}

	api := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(api)

	return mongo.Connect(opts)
}

// disconnectClient gracefully drops the client connection, reporting errors
// to logger.
func disconnectClient(ctx context.Context, client *mongo.Client, logger *zap.Logger) {
	if err := client.Disconnect(ctx); err != nil {
		logger.Sugar().Errorw("failed to disconnect Mongo DB client", "error", err)
	}
}
