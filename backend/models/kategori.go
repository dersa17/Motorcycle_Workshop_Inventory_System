package models

import (
	"github.com/google/uuid"
)

type Kategori struct {
	ID   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Nama string    `gorm:"type:varchar(100);not null"`
	Barang []Barang `gorm:"foreignKey:KategoriID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	CreatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
	UpdatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
}