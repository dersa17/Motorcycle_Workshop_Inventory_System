package services

import (
	"fmt"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/models"
	"gorm.io/gorm"
)

type CategoryService struct {
	DB *gorm.DB
}

func NewCategoryService(db *gorm.DB) *CategoryService {
	return &CategoryService{DB: db}
}

func (s *CategoryService) Create(req *dto.CategoryRequest) (*dto.CategoryResponse, error) {
	category := &models.Kategori{Nama: req.Nama}

	if err := s.DB.Create(&category).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	helpers.LogRiwayatAsync(s.DB, "Membuat data kategori", "Kategori baru berhasil dibuat dengan nama: "+category.Nama)

	response := &dto.CategoryResponse{
		ID:   category.ID,
		Nama: category.Nama,
	}
	return response, nil
}

func (s *CategoryService) GetAll() (*dto.CategoryListResponse, error) {
	var categories []models.Kategori

	if err := s.DB.Unscoped().Find(&categories).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	var responses []dto.CategoryResponse

	for _, category := range categories {
		var da *string
		if category.DeletedAt.Valid {
			t := category.DeletedAt.Time.String()
			da = &t
		} else {
			da = nil
		}
		responses = append(responses, dto.CategoryResponse{
			ID:        category.ID,
			Nama:      category.Nama,
			DeletedAt: da,
		})
	}

	response := &dto.CategoryListResponse{
		Categories: responses,
	}
	return response, nil
}

func (s *CategoryService) GetActive() (*dto.CategoryListResponse, error) {
	var categories []models.Kategori

	if err := s.DB.Where("deleted_at IS NULL").Find(&categories).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	var responses []dto.CategoryResponse
	for _, category := range categories {
		var da *string
		if category.DeletedAt.Valid {
			t := category.DeletedAt.Time.String()
			da = &t
		} else {
			da = nil
		}
		responses = append(responses, dto.CategoryResponse{
			ID:        category.ID,
			Nama:      category.Nama,
			DeletedAt: da,
		})
	}

	response := &dto.CategoryListResponse{
		Categories: responses,
	}
	return response, nil
}

func (s *CategoryService) Update(id string, req *dto.CategoryRequest) (*dto.CategoryResponse, error) {
	category := &models.Kategori{}

	if err := s.DB.First(&category, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	oldNama := category.Nama
	category.Nama = req.Nama

	if err := s.DB.Save(&category).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	helpers.LogRiwayatAsync(s.DB, "Memperbarui data kategori", fmt.Sprintf(
		"Memperbarui kategori dari '%s' menjadi '%s'",
		oldNama,
		category.Nama))

	response := &dto.CategoryResponse{
		ID:   category.ID,
		Nama: category.Nama,
	}
	return response, nil
}

func (s *CategoryService) Delete(id string) (*dto.CategoryResponse, error) {
	category := &models.Kategori{}

	if err := s.DB.First(category, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	namaKategori := category.Nama

	if err := s.DB.Delete(&category, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	helpers.LogRiwayatAsync(s.DB, "Menghapus data kategori", fmt.Sprintf("Menghapus kategori '%s'", namaKategori))

	var da *string

	if category.DeletedAt.Valid {
		t := category.DeletedAt.Time.String()
		da = &t
	} else {
		da = nil
	}

	response := &dto.CategoryResponse{
		ID:        category.ID,
		Nama:      category.Nama,
		DeletedAt: da,
	}
	return response, nil
}

func (s *CategoryService) Restore(id string) (*dto.CategoryResponse, error) {
	category := &models.Kategori{}

	if err := s.DB.Unscoped().First(&category, "id = ?", id).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	if err := s.DB.Unscoped().Model(&category).Update("deleted_at", nil).Error; err != nil {
		return nil, helpers.ParseDBError(err)
	}

	response := &dto.CategoryResponse{
		ID:        category.ID,
		Nama:      category.Nama,
		DeletedAt: nil,
	}
	return response, nil
}
