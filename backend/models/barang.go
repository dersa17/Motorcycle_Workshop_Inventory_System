package models

import (
	"time"
	"github.com/google/uuid"
)

type Barang struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	KategoriID uuid.UUID  `gorm:"type:uuid;not null"`
	Nama      string     `gorm:"type:varchar(100);not null"`
	Harga     float64    `gorm:"type:decimal(10,2);not null"`
	Kategori  Kategori   `gorm:"foreignKey:KategoriID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	Stok        int  `gorm:"type:integer;not null;default:0"`
	StokInitial  int  `gorm:"type:integer;not null;default:0"`
	StokMinimum int  `gorm:"type:integer;not null;default:5"`
	Gambar     string    `gorm:"type:varchar(255)"` 
    CreatedAt time.Time `gorm:"not null;default:current_timestamp"`
    UpdatedAt time.Time `gorm:"not null;default:current_timestamp"`
}