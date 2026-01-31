package controllers

import (
	"net/http"

	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/services"
	"github.com/gin-gonic/gin"
)

type SupplierController struct {
	Service *services.SupplierService
}

func NewSupplierController(service *services.SupplierService) *SupplierController {
	return &SupplierController{
		Service: service,
	}
}

func (c *SupplierController) Create(ctx *gin.Context) {
	req := &dto.SupplierRequest{}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		helpers.Log.WithField("error", err.Error()).Warn("Create supplier failed: invalid data")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid", "details": err.Error()})
		return
	}

	res, err := c.Service.Create(req)
	if err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"name":  req.Nama,
			"error": err.Error(),
		}).Error("Create supplier failed")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	helpers.Log.WithField("name", req.Nama).Info("Supplier created")

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "supplier berhasil dibuat",
		"data":    res,
	})
}

func (c *SupplierController) GetAll(ctx *gin.Context) {
	res, err := c.Service.GetAll()
	if err != nil {
		helpers.Log.WithField("error", err.Error()).Error("Failed to fetch all suppliers")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": res,
	})
}

func (c *SupplierController) Update(ctx *gin.Context) {
	id := ctx.Param("id")
	req := &dto.SupplierRequest{}

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id supplier tidak ditemukan"})
		return
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"id":    id,
			"error": err.Error(),
		}).Warn("Update supplier failed: invalid data")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid", "details": err.Error()})
		return
	}

	res, err := c.Service.Update(id, req)
	if err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"id":    id,
			"error": err.Error(),
		}).Error("Failed to update supplier")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	helpers.Log.WithField("id", id).Info("Supplier updated")

	ctx.JSON(http.StatusOK, gin.H{
		"message": "supplier berhasil diperbarui",
		"data":    res,
	})
}

func (c *SupplierController) Delete(ctx *gin.Context) {
	id := ctx.Param("id")

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id supplier tidak ditemukan"})
		return
	}

	res, err := c.Service.Delete(id)
	if err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"id":    id,
			"error": err.Error(),
		}).Error("Failed to delete supplier")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	helpers.Log.WithField("id", id).Info("Supplier deleted")

	ctx.JSON(http.StatusOK, gin.H{
		"message": "supplier berhasil dihapus",
		"data":    res,
	})
}
