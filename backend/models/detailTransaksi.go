package models

import (
	"github.com/google/uuid"
)

type DetailTransaksi struct {
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	TransaksiID uuid.UUID  `gorm:"type:uuid;not null"`
	BarangID    uuid.UUID  `gorm:"type:uuid;not null"`
	Jumlah      int       `gorm:"type:int;not null"`
	HargaSatuan float64   `gorm:"type:decimal(10,2);not null"`
	Subtotal    float64   `gorm:"type:decimal(10,2);not null"`
	Barang      Barang    `gorm:"foreignKey:BarangID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	Transaksi   Transaksi `gorm:"foreignKey:TransaksiID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	CreatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
	UpdatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
}