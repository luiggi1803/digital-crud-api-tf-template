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
npm run build:tf         # prepara terraform/build/ (solo CI/local; no commitear)
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

## Despliegue opción A (GitHub Actions → HCP Terraform)

```
push develop|main → GitHub Actions (build:tf) → HCP Terraform apply (Remote) → AWS
```

El artefacto Lambda **no** va a git. GHA lo genera y lo sube en el run remoto.

| Rama | Workspace |
|------|-----------|
| `develop` | `digital-crud-api-tf-template-dev` |
| `main` | `digital-crud-api-tf-template-prod` |

### HCP Terraform (cada workspace)

1. Tag `project` = `digital-crud-api`
2. **Workflow = CLI-driven / API-driven** (no VCS auto-apply; si el repo está conectado, desactiva triggers de VCS o cambia a CLI para no duplicar runs fallidos sin `build/`)
3. **Execution Mode = Remote**
4. **Auto Apply = On** (dev; en prod puedes dejar confirmación manual)
5. Variables Env (Sensitive): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
6. Variables Terraform: `aws_region`, `environment` (el workflow también pasa `-var-file`)

### GitHub Secrets

| Secret | Valor |
|--------|--------|
| `TF_API_TOKEN` | Token API de HCP (User Settings → Tokens) |

### Uso

```powershell
git push origin develop   # deploy dev
git push origin main      # deploy prod
```

También: Actions → **Deploy HCP Terraform** → Run workflow.

## Diferencia principal con el proyecto referencia

| Aspecto | Referencia | Este proyecto |
|---------|------------|---------------|
| IaC | AWS CDK | **Terraform** |
| NestJS + Middy | ✅ | ✅ |
| Arquitectura hexagonal | ✅ | ✅ |
| Instana | ✅ | No (simplificado) |
