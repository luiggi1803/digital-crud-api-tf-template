terraform {
  # HCP UI / Actions usan ~1.15; tags key-value requieren TF reciente
  required_version = ">= 1.10.0"

  # Opción A: GitHub Actions → apply remoto en HCP (CLI-driven).
  # Workspaces con tag Key=project Value=digital-crud-api; TF_WORKSPACE elige dev|prod.
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
