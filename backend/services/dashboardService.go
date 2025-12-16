package services

import (
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"gorm.io/gorm"
)

type DashboardService struct {
	DB *gorm.DB
}

func NewDashboardService(db *gorm.DB) *DashboardService {
	return &DashboardService{DB: db}
}

func (s *DashboardService) GetDataDashboard() (*dto.DashbordResponse, error) {
	response := &dto.DashbordResponse{}

	
	if err := s.DB.Table("barangs").
		Count(&response.JumlahBarang).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}


	if err := s.DB.Table("transaksis").
		Count(&response.JumlahTransaksi).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}


	if err := s.DB.Table("suppliers").
		Count(&response.JumlahSupplier).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}


	if err := s.DB.Table("kategoris").
		Count(&response.JumlahKategori).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	if err := s.DB.Table("barangs").
		Select(`id, nama, harga, stok, stok_initial, stok_minimum, gambar`).
		Where("stok <= stok_minimum").
		Order("stok ASC").
		Scan(&response.StokBarangMenipisList).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	if err := s.DB.Table("riwayat_aktivitas").Select(`nama, deskripsi, tanggal`).Order("tanggal desc").Scan(&response.RiwayatAktivitas).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	return response, nil
}
