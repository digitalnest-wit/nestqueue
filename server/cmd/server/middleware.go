package main

import (
	"net/http"
	"strings"

	"go.uber.org/zap"
)

const _clientHost = "localhost"

// corsMiddleware adds CORS headers to allow cross-origin requests
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests only from local clients.
		origin := r.Header.Get("Origin")
		if strings.Contains(origin, _clientHost) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		}

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// logRequestsMiddleware logs each request's method and path to logger
func logRequestsMiddleware(next http.Handler, logger *zap.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sugar := logger.Sugar()
		sugar.Infow("received request", "method", r.Method, "path", r.URL.Path)
		next.ServeHTTP(w, r)
	})
}
