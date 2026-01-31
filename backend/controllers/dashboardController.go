package controllers

import (
	"net/http"

	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/services"
	"github.com/gin-gonic/gin"
)

type DashboardController struct {
	Service *services.DashboardService
}

func NewDashboardController(service *services.DashboardService) *DashboardController {
	return &DashboardController{
		Service: service,
	}
}

func (c *DashboardController) GetDataDashboard(ctx *gin.Context) {
	res, err := c.Service.GetDataDashboard()
	if err != nil {
		helpers.Log.Error("Failed to fetch dashboard data", "error", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}
