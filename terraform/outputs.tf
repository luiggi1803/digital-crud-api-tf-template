output "region_prefix" {
  description = "Prefijo regional de recursos (UE1, UE2)"
  value       = local.region_prefix
}

output "name_prefix" {
  description = "Prefijo de nombres de recursos AWS"
  value       = local.name_prefix
}

output "api_gateway_url" {
  description = "URL base del API Gateway"
  value       = aws_api_gateway_stage.main.invoke_url
}

output "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB"
  value       = aws_dynamodb_table.items.name
}

output "lambda_function_name" {
  description = "Nombre de la función Lambda"
  value       = aws_lambda_function.crud.function_name
}

output "cognito_user_pool_id" {
  description = "ID del Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  description = "ID del cliente Cognito para el frontend (SPA)"
  value       = aws_cognito_user_pool_client.frontend.id
}

output "cognito_region" {
  description = "Región del Cognito User Pool"
  value       = var.aws_region
}

output "crud_endpoints" {
  description = "Endpoints CRUD disponibles"
  value = {
    listar   = "${aws_api_gateway_stage.main.invoke_url}/items"
    obtener  = "${aws_api_gateway_stage.main.invoke_url}/items/{id}"
    crear    = "${aws_api_gateway_stage.main.invoke_url}/items"
    actualizar = "${aws_api_gateway_stage.main.invoke_url}/items/{id}"
    eliminar = "${aws_api_gateway_stage.main.invoke_url}/items/{id}"
  }
}
