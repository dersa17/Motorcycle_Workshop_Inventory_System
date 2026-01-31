package controllers

import (
	"net/http"
	"time"

	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/services"
	"github.com/gin-gonic/gin"
)

type ReportController struct {
	ReportService *services.ReportService
}

func NewReportController(reportService *services.ReportService) *ReportController {
	return &ReportController{ReportService: reportService}
}

func (c *ReportController) GetPurchaseReport(ctx *gin.Context) {
	req := &dto.ReportRequest{}
	if err := ctx.ShouldBindQuery(req); err != nil {
		helpers.Log.WithField("error", err.Error()).Warn("Get purchase report failed: invalid query")
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "format data tidak valid",
			"details": err.Error(),
		})
		return
	}

	start, err := time.Parse(time.RFC3339, req.TanggalMulai)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tanggalMulai tidak valid"})
		return
	}

	end, err := time.Parse(time.RFC3339, req.TanggalSelesai)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tanggalSelesai tidak valid"})
		return
	}

	filter := &dto.ReportFilter{
		TanggalMulai:   start,
		TanggalSelesai: end,
	}

	res, err := c.ReportService.GetPurchaseReport(filter)
	if err != nil {
		helpers.Log.WithField("error", err.Error()).Error("Failed to get purchase report")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}

func (c *ReportController) GetSalesReport(ctx *gin.Context) {
	req := &dto.ReportRequest{}
	if err := ctx.ShouldBindQuery(req); err != nil {
		helpers.Log.WithField("error", err.Error()).Warn("Get sales report failed: invalid query")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid", "details": err.Error()})
		return
	}

	start, err := time.Parse(time.RFC3339, req.TanggalMulai)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tanggalMulai tidak valid"})
		return
	}

	end, err := time.Parse(time.RFC3339, req.TanggalSelesai)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tanggalSelesai tidak valid"})
		return
	}

	filter := &dto.ReportFilter{
		TanggalMulai:   start,
		TanggalSelesai: end,
	}

	res, err := c.ReportService.GetSalesReport(filter)
	if err != nil {
		helpers.Log.WithField("error", err.Error()).Error("Failed to get sales report")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}

func (c *ReportController) GetItemsReport(ctx *gin.Context) {
	req := &dto.ReportRequest{}
	if err := ctx.ShouldBindQuery(req); err != nil {
		helpers.Log.WithField("error", err.Error()).Warn("Get items report failed: invalid query")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid", "details": err.Error()})
		return
	}

	start, err := time.Parse(time.RFC3339, req.TanggalMulai)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tanggalMulai tidak valid"})
		return
	}

	end, err := time.Parse(time.RFC3339, req.TanggalSelesai)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tanggalSelesai tidak valid"})
		return
	}

	filter := &dto.ReportFilter{
		TanggalMulai:   start,
		TanggalSelesai: end,
	}

	res, err := c.ReportService.GetInventoryReport(filter)
	if err != nil {
		helpers.Log.WithField("error", err.Error()).Error("Failed to get inventory report")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}

func (c *ReportController) GetProfitLossReport(ctx *gin.Context) {
	req := &dto.ReportRequest{}
	if err := ctx.ShouldBindQuery(req); err != nil {
		helpers.Log.WithField("error", err.Error()).Warn("Get profit loss report failed: invalid query")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "format data tidak valid", "details": err.Error()})
		return
	}

	start, err := time.Parse(time.RFC3339, req.TanggalMulai)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tanggalMulai tidak valid"})
		return
	}

	end, err := time.Parse(time.RFC3339, req.TanggalSelesai)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tanggalSelesai tidak valid"})
		return
	}

	filter := &dto.ReportFilter{
		TanggalMulai:   start,
		TanggalSelesai: end,
	}

	res, err := c.ReportService.GetProfitLossReport(filter)
	if err != nil {
		helpers.Log.WithField("error", err.Error()).Error("Failed to get profit loss report")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}
