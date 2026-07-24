data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = var.lambda_source_path
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "crud" {
  function_name = "${local.name_prefix}-crud"
  role          = aws_iam_role.lambda.arn
  handler       = "dist/items/infrastructure/bootstrap/App.handler"
  runtime       = var.lambda_runtime
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      REGION               = var.aws_region
      DYNAMODB_TABLE_ITEMS = aws_dynamodb_table.items.name
      AUTH_REQUIRED        = "true"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy.lambda_dynamodb
  ]
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.crud.function_name}"
  retention_in_days = 14
}
