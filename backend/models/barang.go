package models

import (
	"github.com/google/uuid"
)

type Barang struct {
	ID         uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	KategoriID uuid.UUID  `gorm:"type:uuid;not null"`
	Nama      string     `gorm:"type:varchar(100);not null"`
	Harga     float64    `gorm:"type:decimal(10,2);not null"`
	Kategori  Kategori   `gorm:"foreignKey:KategoriID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	CreatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
	UpdatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
}