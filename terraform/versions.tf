terraform {
  required_version = ">= 1.5.0"

  # Opción A: GitHub Actions construye la Lambda → terraform apply (Remote) en HCP.
  # Workspaces: CLI/API-driven (no VCS auto-apply) + tag project=digital-crud-api
  cloud {
    organization = "luiggi-org"

    workspaces {
      tags = {
        project = "digital-crud-api"
      }
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
