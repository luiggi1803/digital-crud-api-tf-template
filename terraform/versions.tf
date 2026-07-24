terraform {
  required_version = ">= 1.5.0"

  # Opción A: GitHub Actions construye la Lambda → terraform apply (Remote) en HCP.
  # Workspaces: CLI/API-driven + tag de workspace "digital-crud-api" (set of string).
  cloud {
    organization = "luiggi-org"

    workspaces {
      tags = ["digital-crud-api"]
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}
