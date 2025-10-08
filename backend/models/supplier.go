package models

import (
	"github.com/google/uuid"
)

type Supplier struct {
	ID   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Nama  string    `gorm:"type:varchar(100);not null"`
	Alamat string   `gorm:"type:varchar(255);not null"`
	Kontak string    `gorm:"type:varchar(15);not null"`
	Transaksi []Transaksi `gorm:"foreignKey:SupplierID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	CreatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`
	UpdatedAt   string    `gorm:"type:timestamp;not null;default:current_timestamp"`

}