package models

import (
	"time"
	"github.com/google/uuid"
)

type User struct {
	ID       uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Username string    `gorm:"type:varchar(50);unique;not null"`
	Password string    `gorm:"type:varchar(255);not null"`
	Email    string    `gorm:"type:varchar(100);unique;not null"`
    CreatedAt time.Time `gorm:"not null;default:current_timestamp"`
    UpdatedAt time.Time `gorm:"not null;default:current_timestamp"`
}