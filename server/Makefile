PORT = 3000

run: install
	@go run cmd/server/main.go \
		cmd/server/logger.go \
		cmd/server/mongo.go \
		cmd/server/middleware.go --port $(PORT)

install:
	@go mod download
