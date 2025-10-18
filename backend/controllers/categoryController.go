package controllers

import (
	"net/http"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
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
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid"})
		return
	}

	res, err := c.Service.Create(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "kategori berhasil dibuat",
		"data":    res,
	})
}

func (c *CategoryController) GetAll(ctx *gin.Context) {
	res, err := c.Service.GetAll()
	if err != nil {
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
    ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid"})
    return
}

	res, err := c.Service.Update(id, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

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
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "kategori berhasil dihapus",
		"data": res,
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
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "kategori berhasil dipulihkan",
		"data":    res,
	})
}
