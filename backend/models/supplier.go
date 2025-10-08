package models

import (
	"time"
	"github.com/google/uuid"
)

type Supplier struct {
	ID   uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Nama  string    `gorm:"type:varchar(100);not null"`
	Alamat string   `gorm:"type:varchar(255);not null"`
	Kontak string    `gorm:"type:varchar(15);not null"`
	Transaksi []Transaksi `gorm:"foreignKey:SupplierID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
    CreatedAt time.Time `gorm:"not null;default:current_timestamp"`
    UpdatedAt time.Time `gorm:"not null;default:current_timestamp"`

}