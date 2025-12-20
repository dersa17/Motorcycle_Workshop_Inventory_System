package services


import (
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/models"
	"gorm.io/gorm"
	"fmt"
)


type SupplierService struct {
	DB *gorm.DB
}

func NewSupplierService(db *gorm.DB) *SupplierService {
	return &SupplierService{DB: db}
}

func (s *SupplierService) Create(req *dto.SupplierRequest) (*dto.SupplierResponse, error) {
	supplier := &models.Supplier{Nama: req.Nama, Alamat: req.Alamat, Kontak: req.Kontak}

	if err := s.DB.Create(supplier).Error; err != nil {
		return  nil, helpers.ParseDBError(err)
	}

	
	helpers.LogRiwayatAsync(s.DB, "Membuat data supplier", fmt.Sprintf("Supplier baru berhasil dibuat dengan nama: %s", supplier.Nama))

	response := &dto.SupplierResponse{
		ID: supplier.ID,
		Nama: supplier.Nama,
		Alamat: supplier.Alamat,
		Kontak: supplier.Kontak,
	}

	return response, nil
}

func (s *SupplierService) GetAll() (*dto.SupplierListResponse, error) {
	var suppliers []models.Supplier

	if err := s.DB.Find(&suppliers).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	var responses []dto.SupplierResponse

	for _, supplier := range suppliers {
		responses = append(responses, dto.SupplierResponse{
			ID: supplier.ID,
			Nama: supplier.Nama,
			Alamat: supplier.Alamat,
			Kontak: supplier.Kontak,
		})
	}


	response := &dto.SupplierListResponse{
		Suppliers: responses,
	}

	return  response, nil
}

func (s* SupplierService) Update(id string, req *dto.SupplierRequest) (*dto.SupplierResponse, error) {
	supplier := &models.Supplier{}

	if err := s.DB.First(supplier, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	supplier.Nama = req.Nama
	supplier.Alamat = req.Alamat
	supplier.Kontak = req.Kontak

	if err := s.DB.Save(supplier).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	helpers.LogRiwayatAsync(s.DB, "Memperbarui data supplier", fmt.Sprintf("Memperbarui supplier dari '%s' ", supplier.Nama))

	response := &dto.SupplierResponse{
		ID:   supplier.ID,
		Nama: supplier.Nama,
		Alamat: supplier.Alamat,
		Kontak: supplier.Kontak,
	}

	return response, nil
}

func (s* SupplierService) Delete(id string) (*dto.SupplierResponse, error) {
	supplier := &models.Supplier{}

	if err:= s.DB.First(supplier, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	if err:= s.DB.Delete(supplier, "id = ?", id).Error; err != nil {
		return  nil, helpers.ParseDBError(err)
	}

	helpers.LogRiwayatAsync(s.DB, "Menghapus data supplier", fmt.Sprintf("Menghapus supplier '%s'", supplier.Nama))

	response := &dto.SupplierResponse{
		ID: supplier.ID,
		Nama: supplier.Nama,
		Alamat: supplier.Alamat,
		Kontak: supplier.Kontak,
	}

	return  response, nil
}