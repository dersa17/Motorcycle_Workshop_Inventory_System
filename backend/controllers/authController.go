package controllers

import (
	"net/http"

	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/config"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/dto"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/helpers"
	"github.com/dersa17/Motorcycle_Workshop_Inventory_System/backend/services"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	Service *services.AuthService
}

func NewAuthController(service *services.AuthService) *AuthController {
	return &AuthController{
		Service: service,
	}
}

func (c *AuthController) Login(ctx *gin.Context) {
	request := &dto.LoginRequest{}

	err := ctx.ShouldBindJSON(request)
	if err != nil {
		helpers.Log.WithField("error", err.Error()).Warn("Login failed: invalid json")
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":  "data login tidak valid",
			"detail": err.Error(),
		})
		return
	}

	res, err := c.Service.Login(request)
	if err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"username": request.Username,
			"error":    err.Error(),
		}).Warn("Login failed: invalid credentials")
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	helpers.Log.WithFields(map[string]interface{}{
		"username": request.Username,
		"user_id":  res.User.ID,
	}).Info("Login successful")

	cfg := config.LoadConfig()

	// Konfigurasi Cookie yang aman untuk Dev & Prod
	// Masalah umum: SameSite=None WAJIB Secure=true.
	// Jadi kalau di localhost (Dev) Secure=false, maka SameSite harus Lax, tidak boleh None.
	var secure bool
	var sameSite http.SameSite

	if cfg.APP_ENV == "production" {
		secure = true
		sameSite = http.SameSiteNoneMode // Cross-site cookie (Prod/HTTPS)
	} else {
		secure = false
		sameSite = http.SameSiteLaxMode // Localhost cookie (Dev/HTTP)
	}

	ctx.SetSameSite(sameSite)
	// Domain dikosongkan ("") agar otomatis mengikuti host (localhost)
	ctx.SetCookie("token", res.Token, 3600*24, "/", "", secure, true)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "login berhasil",
		"data":    res,
	})

}

func (c *AuthController) Logout(ctx *gin.Context) {
	helpers.Log.Info("User logout")
	ctx.SetCookie("token", "", -1, "/", "localhost", false, true)
	ctx.JSON(http.StatusOK, gin.H{
		"message": "logout berhasil",
	})
}

func (c *AuthController) Me(ctx *gin.Context) {
	userAny, ok := ctx.Get("currentUser")
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "user tidak ditemukan"})
		return
	}

	currentUser, ok := userAny.(*dto.UserResponse)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "format user tidak valid"})
		return
	}

	res, err := c.Service.Me(currentUser)
	if err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"user_id": currentUser.ID,
			"error":   err.Error(),
		}).Error("Failed to fetch user profile")
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    res,
	})
}

func (c *AuthController) UpdateProfile(ctx *gin.Context) {
	request := &dto.UserUpdateRequest{}

	if err := ctx.ShouldBindJSON(request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	userAny, ok := ctx.Get("currentUser")
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "user tidak ditemukan"})
		return
	}

	currentUser, ok := userAny.(*dto.UserResponse)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "format user tidak valid"})
		return
	}

	res, err := c.Service.UpdateProfile(currentUser, request)
	if err != nil {
		helpers.Log.WithFields(map[string]interface{}{
			"user_id": currentUser.ID,
			"error":   err.Error(),
		}).Error("Failed to update profile")
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	helpers.Log.WithField("user_id", currentUser.ID).Info("Profile updated")

	ctx.JSON(http.StatusOK, gin.H{
		"message": "berhasil memperbarui profile",
		"data":    res,
	})
}
