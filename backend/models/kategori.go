package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Kategori struct {
	ID   uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Nama string    `gorm:"type:varchar(100);not null"`
	Barang []Barang `gorm:"foreignKey:KategoriID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
    CreatedAt time.Time `gorm:"not null;default:current_timestamp"`
    UpdatedAt time.Time `gorm:"not null;default:current_timestamp"`
	DeletedAt  gorm.DeletedAt `gorm:"index"`
}