package services

import (
	"errors"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"strconv"
	"time"
)

type TransactionService struct {
	DB *gorm.DB
}

func NewTransactionService(db *gorm.DB) *TransactionService {
	return &TransactionService{DB: db}
}

func calculateTotal(items []models.DetailTransaksi) float64 {
	total := float64(0)
	for _, item := range items {
		total += item.Subtotal
	}
	return total
}

func (s *TransactionService) Create(req *dto.TransactionRequest) (*dto.TransactionResponse, error) {

	detailItems := make([]models.DetailTransaksi, len(req.DetailTransaksi))

	// Siapkan detail items dulu
	for i, item := range req.DetailTransaksi {
		detailItems[i] = models.DetailTransaksi{
			BarangID:    item.BarangID,
			Jumlah:      item.Jumlah,
			HargaSatuan: item.HargaSatuan,
			Subtotal:    float64(item.Jumlah) * item.HargaSatuan,
		}
	}

	// Handle tanggal
	var tgl time.Time
	if req.Tanggal == "" {
		tgl = time.Now()
	} else {
		parsedTime, err := time.Parse("2006-01-02T15:04:05.000Z", req.Tanggal)
		if err != nil {
			return nil, err
		}
		tgl = parsedTime
	}

	var supplierUUID *uuid.UUID

	if req.Jenis == "pembelian" {
		parsed, _ := uuid.Parse(*req.SupplierID)
		supplierUUID = &parsed
	} else {
		supplierUUID = nil
	}

	// Buat struct transaksi
	transaction := &models.Transaksi{
		SupplierID:      supplierUUID,
		Jenis:           req.Jenis,
		Tanggal:         tgl,
		Total:           calculateTotal(detailItems),
		DetailTransaksi: detailItems,
	}

	err := s.DB.Transaction(func(tx *gorm.DB) error {

		// Loop setiap item transaksi
		for _, item := range req.DetailTransaksi {

			var barang models.Barang
			if err := tx.First(&barang, "id = ?", item.BarangID).Error; err != nil {
				return helpers.ParseDBError(err)
			}

			switch req.Jenis {

			case "pembelian":
				barang.Stok += item.Jumlah

			case "penjualan":
				if barang.Stok < item.Jumlah {
					return errors.New(
						"stok barang " + barang.Nama +
							" tidak cukup. stok tersisa: " + strconv.Itoa(barang.Stok),
					)
				}
				barang.Stok -= item.Jumlah

			default:
				return errors.New("jenis transaksi '" + req.Jenis + "' tidak valid")
			}

			// Simpan stok baru
			if err := tx.Save(&barang).Error; err != nil {
				return err
			}
		}

		// Simpan transaksi ke database
		if err := tx.Create(transaction).Error; err != nil {
			return helpers.ParseDBError(err)
		}

		return nil
	})

	// Jika transaksi gagal
	if err != nil {
		return nil, err
	}

	// Ambil ulang transaksi lengkap
	var created models.Transaksi
	if err := s.DB.Preload("DetailTransaksi").
		Preload("DetailTransaksi.Barang").
		Preload("Supplier").
		First(&created, "id = ?", transaction.ID).Error; err != nil {

		return nil, helpers.ParseDBError(err)
	}

	// Buat response DTO
	response := &dto.TransactionResponse{
		ID: created.ID,
		Supplier: dto.SupplierResponse{
			ID:   transaction.Supplier.ID,
			Nama: transaction.Supplier.Nama,
		},
		Jenis:           created.Jenis,
		Tanggal:         created.Tanggal.Format("2006-01-02 15:04:05"),
		Total:           created.Total,
		DetailTransaksi: []dto.DetailTransactionResponse{},
	}

	for _, detail := range created.DetailTransaksi {
		response.DetailTransaksi = append(response.DetailTransaksi, dto.DetailTransactionResponse{
			ID: detail.ID,
			Barang: dto.ItemResponse{
				ID:   detail.Barang.ID,
				Nama: detail.Barang.Nama,
				Stok: detail.Barang.Stok,
			},
			Jumlah:      detail.Jumlah,
			HargaSatuan: detail.HargaSatuan,
			Subtotal:    detail.Subtotal,
		})
	}

	return response, nil
}

func (s *TransactionService) GetAll() (*dto.TransactionListResponse, error) {
	var transactions []models.Transaksi
	if err := s.DB.Preload("Supplier").
		Preload("DetailTransaksi").
		Preload("DetailTransaksi.Barang").
		Find(&transactions).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}
	var responses []dto.TransactionResponse
	for _, transaction := range transactions {
		detailResponses := []dto.DetailTransactionResponse{}
		for _, detail := range transaction.DetailTransaksi {
			detailResponses = append(detailResponses, dto.DetailTransactionResponse{
				ID: detail.ID,
				Barang: dto.ItemResponse{
					ID:   detail.Barang.ID,
					Nama: detail.Barang.Nama,
					Stok: detail.Barang.Stok,
				},
				Jumlah:      detail.Jumlah,
				HargaSatuan: detail.HargaSatuan,
				Subtotal:    detail.Subtotal,
			})
		}
		responses = append(responses, dto.TransactionResponse{
			ID: transaction.ID,
			Supplier: dto.SupplierResponse{
				ID:   transaction.Supplier.ID,
				Nama: transaction.Supplier.Nama,
			},
			Jenis:           transaction.Jenis,
			Tanggal:         transaction.Tanggal.Format("2006-01-02 15:04:05"),
			Total:           transaction.Total,
			DetailTransaksi: detailResponses,
		})
	}
	return &dto.TransactionListResponse{
		Transactions: responses,
	}, nil
}

func (s *TransactionService) Update(id string, req *dto.TransactionUpdateRequest) (*dto.TransactionResponse, error) {

	var existing models.Transaksi

	// Ambil transaksi lama
	if err := s.DB.Preload("DetailTransaksi").
		First(&existing, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	err := s.DB.Transaction(func(tx *gorm.DB) error {

		// ============================
		// 1. ROLLBACK STOK DETAIL LAMA
		// ============================
		for _, detail := range existing.DetailTransaksi {

			var barang models.Barang
			if err := tx.First(&barang, "id = ?", detail.BarangID).Error; err != nil {
				return helpers.ParseDBError(err)
			}

			switch existing.Jenis {
			case "pembelian":
				barang.Stok -= detail.Jumlah

			case "penjualan":
				barang.Stok += detail.Jumlah
			}

			if err := tx.Save(&barang).Error; err != nil {
				return err
			}
		}

		// ============================
		// 2. HAPUS DETAIL LAMA
		// ============================
		if err := tx.Where("transaksi_id = ?", id).Delete(&models.DetailTransaksi{}).Error; err != nil {
			return err
		}

		// ============================
		// 3. SIAPKAN DETAIL BARU
		// ============================
		newDetails := make([]models.DetailTransaksi, len(req.DetailTransaksi))
		for i, item := range req.DetailTransaksi {
			newDetails[i] = models.DetailTransaksi{
				BarangID:    item.BarangID,
				Jumlah:      item.Jumlah,
				HargaSatuan: item.HargaSatuan,
				Subtotal:    float64(item.Jumlah) * item.HargaSatuan,
			}
		}

		// ============================
		// 4. VALIDASI & UPDATE STOK BARU
		// ============================
		for _, item := range req.DetailTransaksi {

			var barang models.Barang
			if err := tx.First(&barang, "id = ?", item.BarangID).Error; err != nil {
				return helpers.ParseDBError(err)
			}

			switch req.Jenis {

			case "pembelian":
				barang.Stok += item.Jumlah

			case "penjualan":
				if barang.Stok < item.Jumlah {
					return errors.New(
						"stok barang " + barang.Nama +
							" tidak cukup. stok tersisa: " + strconv.Itoa(barang.Stok),
					)
				}
				barang.Stok -= item.Jumlah

			default:
				return errors.New("jenis transaksi '" + req.Jenis + "' tidak valid")
			}

			if err := tx.Save(&barang).Error; err != nil {
				return err
			}
		}

		// ============================
		// 5. HANDLE TANGGAL
		// ============================
		var tgl time.Time
		if req.Tanggal == "" {
			tgl = existing.Tanggal
		} else {
			parsedTime, err := time.Parse("2006-01-02T15:04:05.000Z", req.Tanggal)
			if err != nil {
				return err
			}
			tgl = parsedTime
		}

		var supplierUUID *uuid.UUID

		if req.Jenis == "pembelian" {
			parsed, _ := uuid.Parse(*req.SupplierID)
			supplierUUID = &parsed
		} else {
			supplierUUID = nil
		}

		// ============================
		// 6. UPDATE TRANSAKSI UTAMA
		// ============================
		existing.SupplierID = supplierUUID
		existing.Jenis = req.Jenis
		existing.Tanggal = tgl
		existing.DetailTransaksi = newDetails
		existing.Total = calculateTotal(newDetails)

		if err := tx.Save(&existing).Error; err != nil {
			return helpers.ParseDBError(err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Ambil ulang data lengkap untuk response
	if err := s.DB.Preload("DetailTransaksi").
		Preload("DetailTransaksi.Barang").
		Preload("Supplier").
		First(&existing, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	// ============================
	// 7. Build response DTO
	// ============================
	response := &dto.TransactionResponse{
		ID: existing.ID,
		Supplier: dto.SupplierResponse{
			ID:   existing.Supplier.ID,
			Nama: existing.Supplier.Nama,
		},
		Jenis:           existing.Jenis,
		Tanggal:         existing.Tanggal.Format("2006-01-02 15:04:05"),
		Total:           existing.Total,
		DetailTransaksi: []dto.DetailTransactionResponse{},
	}

	for _, detail := range existing.DetailTransaksi {
		response.DetailTransaksi = append(response.DetailTransaksi, dto.DetailTransactionResponse{
			ID: detail.ID,
			Barang: dto.ItemResponse{
				ID:   detail.Barang.ID,
				Nama: detail.Barang.Nama,
				Stok: detail.Barang.Stok,
			},
			Jumlah:      detail.Jumlah,
			HargaSatuan: detail.HargaSatuan,
			Subtotal:    detail.Subtotal,
		})
	}

	return response, nil
}
