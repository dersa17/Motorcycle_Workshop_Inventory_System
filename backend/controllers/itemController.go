package controllers

import (
	"net/http"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/services"
	"github.com/gin-gonic/gin"
)

type ItemController struct {
	ItemService *services.ItemService
}

func NewItemController(itemService *services.ItemService) *ItemController {
	return &ItemController{ItemService: itemService}
}

func (c *ItemController) Create(ctx *gin.Context) {
	req := &dto.ItemRequest{}


	if err := ctx.ShouldBind(req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid", "details": err.Error()})
		return
	}

	file, _ := ctx.FormFile("gambar")

	res, err := c.ItemService.Create(req, file)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "barang berhasil dibuat",
		"data":    res,
	})
}


func (c *ItemController) GetAll(ctx *gin.Context) {
	res, err := c.ItemService.GetAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": res,
	})
}

func (c *ItemController) Update(ctx *gin.Context) {
	id := ctx.Param("id")
	req := &dto.ItemUpdateRequest{}

	if err := ctx.ShouldBind(req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid", "details": err.Error()})
		return
	}

	file, _ := ctx.FormFile("gambar")

	res, err := c.ItemService.Update(id, req, file)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "barang berhasil diperbarui",
		"data":    res,
	})
}

func (c *ItemController) Delete(ctx *gin.Context) {
	id := ctx.Param("id")

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id barang tidak ditemukan"})
		return
	}

	res, err := c.ItemService.Delete(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "barang berhasil dihapus",
		"data":    res,
	})
}
