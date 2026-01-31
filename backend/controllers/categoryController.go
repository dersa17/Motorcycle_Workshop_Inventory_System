package controllers

import (
	"net/http"

	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/services"
	"github.com/gin-gonic/gin"
)

type CategoryController struct {
	Service *services.CategoryService
}

func NewCategoryController(service *services.CategoryService) *CategoryController {
	return &CategoryController{
		Service: service,
	}
}

func (c *CategoryController) Create(ctx *gin.Context) {
	req := &dto.CategoryRequest{}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		helpers.Log.WithField("error", err.Error()).Warn("Create category failed: invalid data")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid"})
		return
	}

	res, err := c.Service.Create(req)
	if err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"name":  req.Nama,
			"error": err.Error(),
		}).Error("Create category failed")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	helpers.Log.WithField("name", req.Nama).Info("Category created")

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "kategori berhasil dibuat",
		"data":    res,
	})
}

func (c *CategoryController) GetAll(ctx *gin.Context) {
	res, err := c.Service.GetAll()
	if err != nil {
		helpers.Log.WithField("error", err.Error()).Error("Failed to fetch all categories")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": res,
	})
}

func (c *CategoryController) GetActive(ctx *gin.Context) {
	res, err := c.Service.GetActive()
	if err != nil {
		helpers.Log.WithField("error", err.Error()).Error("Failed to fetch active categories")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": res,
	})
}

func (c *CategoryController) Update(ctx *gin.Context) {
	id := ctx.Param("id")
	req := &dto.CategoryRequest{}

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id kategori tidak ditemukan"})
		return
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"id":    id,
			"error": err.Error(),
		}).Warn("Update category failed: invalid data")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid"})
		return
	}

	res, err := c.Service.Update(id, req)
	if err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"id":    id,
			"error": err.Error(),
		}).Error("Failed to update category")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	helpers.Log.WithField("id", id).Info("Category updated")

	ctx.JSON(http.StatusOK, gin.H{
		"message": "kategori berhasil diperbarui",
		"data":    res,
	})
}

func (c *CategoryController) Delete(ctx *gin.Context) {
	id := ctx.Param("id")

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id kategori tidak ditemukan"})
		return
	}

	res, err := c.Service.Delete(id)
	if err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"id":    id,
			"error": err.Error(),
		}).Error("Failed to delete category")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	helpers.Log.WithField("id", id).Info("Category deleted")

	ctx.JSON(http.StatusOK, gin.H{
		"message": "kategori berhasil dihapus",
		"data":    res,
	})
}

func (c *CategoryController) Restore(ctx *gin.Context) {
	id := ctx.Param("id")

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id kategori tidak ditemukan"})
		return
	}

	res, err := c.Service.Restore(id)
	if err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"id":    id,
			"error": err.Error(),
		}).Error("Failed to restore category")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	helpers.Log.WithField("id", id).Info("Category restored")

	ctx.JSON(http.StatusOK, gin.H{
		"message": "kategori berhasil dipulihkan",
		"data":    res,
	})
}
