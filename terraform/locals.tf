locals {
  region_prefix = var.aws_region == "us-east-1" ? "UE1" : var.aws_region == "us-east-2" ? "UE2" : upper(replace(var.aws_region, "-", ""))
  name_prefix   = "${local.region_prefix}-${var.project_name}-${var.environment}"
  table_name    = "${local.name_prefix}-items"
}
