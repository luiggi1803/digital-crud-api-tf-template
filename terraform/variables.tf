variable "aws_region" {
  description = "Región AWS (dev: us-east-2, prod: us-east-1)"
  type        = string
  default     = "us-east-2"

  validation {
    condition     = contains(["us-east-1", "us-east-2"], var.aws_region)
    error_message = "La región debe ser us-east-1 (prod) o us-east-2 (dev)."
  }
}

variable "environment" {
  description = "Ambiente (dev, test, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "digital-crud-api"
}

variable "lambda_runtime" {
  description = "Runtime de Lambda"
  type        = string
  default     = "nodejs22.x"
}

variable "lambda_timeout" {
  description = "Timeout de Lambda en segundos"
  type        = number
  default     = 30
}

variable "lambda_memory" {
  description = "Memoria de Lambda en MB"
  type        = number
  default     = 256
}

variable "api_throttling_burst_limit" {
  description = "Límite burst de throttling en API Gateway"
  type        = number
  default     = 100
}

variable "api_throttling_rate_limit" {
  description = "Límite de tasa de throttling en API Gateway (req/s)"
  type        = number
  default     = 50
}
