package main

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	env := os.Getenv("ENV")
	if env == "" {
		env = "development"
	}

	// Services
	authService := os.Getenv("AUTH_SERVICE")
	userService := os.Getenv("USER_SERVICE")
	hotelService := os.Getenv("HOTEL_SERVICE")
	reviewService := os.Getenv("REVIEW_SERVICE")
	orderService := os.Getenv("ORDER_SERVICE")
	paymentService := os.Getenv("PAYMENT_SERVICE")
	notificationService := os.Getenv("NOTIFICATION_SERVICE")
	searchService := os.Getenv("SEARCH_SERVICE")

	// Create router
	r := gin.Default()

	// CORS config (adjust origin to match frontend port)
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:5003"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	r.Use(cors.New(corsConfig))

	// Route definitions
	r.Any("/api/auth/*path", func(c *gin.Context) {
		proxyRequest(authService, "/api/users", c)
	})

	r.Any("/api/users/*path", func(c *gin.Context) {
		proxyRequest(userService, "/api/users", c)
	})

	r.Any("/api/drivers/*path", func(c *gin.Context) {
		proxyRequest(userService, "/api/drivers", c)
	})

	r.Any("/api/hotelOwners/*path", func(c *gin.Context) {
		proxyRequest(userService, "/api/hotelOwners", c)
	})

	r.Any("/api/hotel/*path", func(c *gin.Context) {
		proxyRequest(hotelService, "/api/users", c)
	})

	r.Any("/api/review/*path", func(c *gin.Context) {
		proxyRequest(reviewService, "/api/users", c)
	})

	r.Any("/api/order/*path", func(c *gin.Context) {
		proxyRequest(orderService, "/api/users", c)
	})

	r.Any("/api/payment/*path", func(c *gin.Context) {
		proxyRequest(paymentService, "/api/users", c)
	})

	r.Any("/api/notification/*path", func(c *gin.Context) {
		proxyRequest(notificationService, "/api/users", c)
	})

	r.Any("/api/search/*path", func(c *gin.Context) {
		proxyRequest(searchService, "/api/users", c)
	})

	// Run server on port 3000
	r.Run(":3000")
}

// Proxies incoming requests to the target service
func proxyRequest(target string, prefix string, c *gin.Context) {
	if c.Request.Method == http.MethodOptions {
		c.Status(http.StatusOK)
		return
	}

	remote, err := url.Parse(target)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse target URL"})
		return
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)

	proxy.Director = func(req *http.Request) {
		req.URL.Scheme = remote.Scheme
		req.URL.Host = remote.Host
		req.URL.Path = path.Join(prefix, c.Param("path"))
		req.Host = remote.Host

		// Copy headers safely
		req.Header = make(http.Header)
		for key, values := range c.Request.Header {
			for _, value := range values {
				req.Header.Add(key, value)
			}
		}
	}

	proxy.ServeHTTP(c.Writer, c.Request)
}
