# Stage 1: Build the Go application
FROM golang 

# Set working directory
WORKDIR /app

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the binary (statically linked for alpine)
# CGO_ENABLED=0 GOOS=linux
RUN go build -o main .


# Expose the port your app listens on
EXPOSE 3006

# Run the app
CMD ["./main"]