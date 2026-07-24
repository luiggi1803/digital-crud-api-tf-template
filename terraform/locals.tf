locals {
  region_prefix = var.aws_region == "us-east-1" ? "UE1" : var.aws_region == "us-east-2" ? "UE2" : upper(replace(var.aws_region, "-", ""))
  name_prefix   = "${local.region_prefix}-${var.project_name}-${var.environment}"
  table_name    = "${local.name_prefix}-items"

  api_resources = {
    items   = aws_api_gateway_resource.items.id
    item_id = aws_api_gateway_resource.item_id.id
  }

  api_routes = {
    items_get = {
      resource_key  = "items"
      http_method   = "GET"
      authorization = "COGNITO_USER_POOLS"
    }
    items_post = {
      resource_key  = "items"
      http_method   = "POST"
      authorization = "COGNITO_USER_POOLS"
    }
    items_options = {
      resource_key  = "items"
      http_method   = "OPTIONS"
      authorization = "NONE"
    }
    item_get = {
      resource_key  = "item_id"
      http_method   = "GET"
      authorization = "COGNITO_USER_POOLS"
    }
    item_put = {
      resource_key  = "item_id"
      http_method   = "PUT"
      authorization = "COGNITO_USER_POOLS"
    }
    item_delete = {
      resource_key  = "item_id"
      http_method   = "DELETE"
      authorization = "COGNITO_USER_POOLS"
    }
    item_options = {
      resource_key  = "item_id"
      http_method   = "OPTIONS"
      authorization = "NONE"
    }
  }
}
