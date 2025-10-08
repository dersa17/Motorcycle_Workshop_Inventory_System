package models

import (
	"time"
	"github.com/google/uuid"
)

type Transaksi struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	SupplierID uuid.UUID  `gorm:"type:uuid"`
	Jenis	 string    `gorm:"type:varchar(9);not null"` // e.g., "pembelian" or "penjualan"
	Tanggal   time.Time `gorm:"not null"`
    CreatedAt time.Time `gorm:"not null;default:current_timestamp"`
    UpdatedAt time.Time `gorm:"not null;default:current_timestamp"`
	Supplier  Supplier  `gorm:"foreignKey:SupplierID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	DetailTransaksi []DetailTransaksi `gorm:"foreignKey:TransaksiID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}