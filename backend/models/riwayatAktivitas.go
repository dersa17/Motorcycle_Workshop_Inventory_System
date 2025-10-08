package models

import (
	"time"
	"github.com/google/uuid"
)

type RiwayatAktivitas struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Nama     string    `gorm:"type:varchar(100);not null"`
	Deskripsi string    `gorm:"type:text;not null"`
	Tanggal   time.Time `gorm:"not null"`
    CreatedAt time.Time `gorm:"not null;default:current_timestamp"`
    UpdatedAt time.Time `gorm:"not null;default:current_timestamp"`
}