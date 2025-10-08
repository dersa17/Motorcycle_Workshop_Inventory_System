package models

import (
	"github.com/google/uuid"
)

type Transaksi struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	SupplierID uuid.UUID  `gorm:"type:uuid"`
	Jenis	 string    `gorm:"type:varchar(9);not null"` // e.g., "pembelian" or "penjualan"
	Tanggal   string    `gorm:"type:timestamp;not null"`
	CreatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
	UpdatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
	Supplier  Supplier  `gorm:"foreignKey:SupplierID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	DetailTransaksi []DetailTransaksi `gorm:"foreignKey:TransaksiID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}