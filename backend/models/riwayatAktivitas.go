package models

import (
	"github.com/google/uuid"
)

type RiwayatAktivitas struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Nama     string    `gorm:"type:varchar(100);not null"`
	Deskripsi string    `gorm:"type:text;not null"`
	Tanggal   string    `gorm:"type:timestamp;not null"`
	CreatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
	UpdatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
}