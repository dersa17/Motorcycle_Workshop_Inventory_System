package helpers

import (
	"os"

	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/config"
	"github.com/sirupsen/logrus"
)

var Log *logrus.Logger

func InitLogger() {
	env := config.LoadConfig().APP_ENV

	Log = logrus.New()

	// Set Output
	Log.Out = os.Stdout

	// Set Formatter
	if env == "production" {
		Log.SetFormatter(&logrus.JSONFormatter{})
	} else {
		// Output mirip gin.Default (berwarna)
		Log.SetFormatter(&logrus.TextFormatter{
			ForceColors:     true,
			FullTimestamp:   true,
			TimestampFormat: "2006-01-02 15:04:05",
		})
	}

	// Set Level dynamically based on environment
	if env == "production" {
		Log.SetLevel(logrus.InfoLevel)
	} else {
		Log.SetLevel(logrus.DebugLevel)
	}
}
