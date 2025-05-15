package main

import (
	"fmt"
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// configureLogger creates a new ready-to-use logger
func configureLogger() (*zap.Logger, error) {
	// Define level-handling logic
	highPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl >= zapcore.ErrorLevel
	})
	lowPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl < zapcore.ErrorLevel
	})

	// High-priority output should go to standard error, and low-priority
	// output should go to standard out
	consoleDebugging := zapcore.Lock(os.Stdout)
	consoleErrors := zapcore.Lock(os.Stderr)

	// Optimize the console output for human operators
	cfg := zap.NewDevelopmentEncoderConfig()
	consoleEncoder := zapcore.NewConsoleEncoder(cfg)

	core := zapcore.NewTee(
		zapcore.NewCore(consoleEncoder, consoleErrors, highPriority),
		zapcore.NewCore(consoleEncoder, consoleDebugging, lowPriority),
	)

	return zap.New(core).Named("nestqueue"), nil
}

// syncLogger flushes any unclosed files
func syncLogger(logger *zap.Logger) {
	if err := logger.Sync(); err != nil {
		fmt.Fprintf(os.Stderr, "failed to sync logger: %s", err)
	}
}
