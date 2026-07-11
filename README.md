# digital-crud-api-tf

API CRUD serverless con **Terraform**, **NestJS**, **Middy** y **arquitectura hexagonal**, alineada con `digital-autogestion-privado-api-ch-impl` (excepto IaC: Terraform en lugar de CDK).

## Stack

| Componente | Tecnología |
|------------|------------|
| IaC | Terraform |
| Runtime | Node.js 20 + TypeScript |
| Framework | NestJS (DI sin servidor HTTP) |
| Middleware | Middy (request, SSM, event-source, crud-action) |
| Base de datos | DynamoDB |
| API | API Gateway REST |
| Validación | Joi |
| Tests | Jest + jest-cucumber (Gherkin) + @nestjs/testing |

## Arquitectura hexagonal

```
src/
├── common/
│   ├── application/       # Excepciones, validación, DTOs
│   └── core/              # Middlewares Middy
│   └── infrastructure/    # AdaptadorDynamo
└── items/
    ├── application/       # DTOs, ItemService, ItemRequestValidation
    ├── domain/            # Item, ItemRepository (puerto), ItemDomainService
    └── infrastructure/    # Controller, Repository, Bootstrap (Lambda)
        ├── bootstrap/     # App.ts, AppModule.ts, HandlerCore.ts
        ├── controller/    # ItemController, ItemsModule
        └── repository/    # ItemDynamoRepository
```

## Flujo de request (igual que el proyecto referencia)

```
API Gateway → Middy → NestJS AppContext → HandlerCore → ItemController[action](payload)
```

Acciones: `listarItems`, `obtenerItem`, `crearItem`, `actualizarItem`, `eliminarItem`

## Comandos

```bash
npm install
npm run test
npm run build
npm run start:local    # http://localhost:3000
```

## Pruebas (estructura igual al proyecto referencia)

```
test/
├── core/                    # Tests de middlewares
├── utils/                   # AWSTestHelper + middleware-lambda.json
└── features/items/
    ├── *.feature            # Escenarios Gherkin
    ├── steps/*.steps.ts     # jest-cucumber
    ├── data/                # request, response, mock
    ├── util/                # Mocks del módulo
    └── unit/                # Tests unitarios NestJS
```

## Despliegue Terraform

```bash
cd terraform
terraform init
terraform apply
```

## Diferencia principal con el proyecto referencia

| Aspecto | Referencia | Este proyecto |
|---------|------------|---------------|
| IaC | AWS CDK | **Terraform** |
| NestJS + Middy | ✅ | ✅ |
| Arquitectura hexagonal | ✅ | ✅ |
| Instana | ✅ | No (simplificado) |
