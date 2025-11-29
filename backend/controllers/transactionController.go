package controllers

import (
	"net/http"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/services"
	"github.com/gin-gonic/gin"
)

type TransactionController struct {
	TransactionService *services.TransactionService
}

func NewTransactionController(transactionService *services.TransactionService) *TransactionController {
	return &TransactionController{TransactionService: transactionService}
}

func (c *TransactionController) Create(ctx *gin.Context) {
	req := &dto.TransactionRequest{}	
	if err := ctx.ShouldBindJSON(req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid", "details": err.Error()})
		return
	}

	res, err := c.TransactionService.Create(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"message": "transaksi berhasil dibuat",
		"data":    res,
	})
}

func (c *TransactionController) GetAll(ctx *gin.Context) {
	res, err := c.TransactionService.GetAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"data": res,
	})
}


func (c *TransactionController) Update(ctx *gin.Context) {
	id := ctx.Param("id")
	req := &dto.TransactionUpdateRequest{}
	if err := ctx.ShouldBindJSON(req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid", "details": err.Error()})
		return
	}
	res, err := c.TransactionService.Update(id, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "transaksi berhasil diperbarui",
		"data":    res,
	})
}