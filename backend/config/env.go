package config

import (
	"os"
	"github.com/joho/godotenv"
	"log"
)


type Config struct {
	DATABASE_URL string
	APP_ENV string
	JWT_SECRET_KEY string
	FRONTEND_ORIGINS string
}

var cfg *Config

func LoadConfig() *Config {
	if cfg != nil {
		return  cfg
	}

	err := godotenv.Load()
	if err != nil {
		log.Println("Info: .env file not found, using system environment variables")
	}

	cfg = &Config{
		DATABASE_URL: os.Getenv("DATABASE_URL"),
		APP_ENV: os.Getenv("APP_ENV"),
		JWT_SECRET_KEY: os.Getenv("JWT_SECRET_KEY"),
		FRONTEND_ORIGINS: os.Getenv("FRONTEND_ORIGINS"),
	}
	return  cfg
}