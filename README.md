# backend-interview-task

Uma API robusta para gerenciamento de usuários com autenticação AWS Cognito, construída com TypeScript, Koa.js e PostgreSQL.

## ✨ Funcionalidades

- ✅ Autenticação JWT com AWS Cognito
- ✅ CRUD completo de usuários
- ✅ Autorização baseada em roles (admin/user)
- ✅ Validação de dados com Joi
- ✅ Paginação de resultados
- ✅ Documentação Swagger automática
- ✅ TypeScript para tipagem estática
- ✅ PostgreSQL com TypeORM
- ✅ Health check endpoint

## 🛠 Tecnologias

- **Runtime**: Node.js 22
- **Framework**: Koa.js
- **Linguagem**: TypeScript
- **Database**: PostgreSQL + TypeORM
- **Autenticação**: AWS Cognito
- **Validação**: Joi
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest

## 📋 Pré-requisitos

- Node.js 22 ou superior
- PostgreSQL 17+
- Conta AWS com Cognito configurado
- npm ou yarn

## 🚀 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/rdgouveia/backend-interview-task.git
cd backend-interview-task
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

## ⚙️ Configuração

### Configuração do AWS Cognito

1. Crie um User Pool na AWS Cognito (Sem secret)
2. Configure os App Clients
3. Crie os grupos 'admin' e 'user'
4. Obtenha as credenciais necessárias e as inclua no .env

### Configuração do Banco de Dados

1. Crie um database PostgreSQL
2. Inclua suas credencias no .env

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco

# AWS Cognito
AWS_REGION=us-east-1
AWS_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🏃 Execução

### Desenvolvimento

```bash
# Modo desenvolvimento com hot reload
npm run dev

# Ou compile e execute
docker compose build
docker compose up
```

## 📚 Documentação da API

A documentação interativa da API está disponível através do Swagger UI:

- **Swagger UI**: http://localhost:3000/api-docs
- **JSON Spec**: http://localhost:3000/api-docs/json

A documentação inclui:

- Todos os endpoints disponíveis
- Schemas de request/response
- Exemplos de uso
- Códigos de resposta
- Configuração de autenticação

## 📁 Estrutura do Projeto

```
src/
├── config/           # Configurações da aplicação
│   ├── database.ts   # Configuração do TypeORM
│   └── swagger.ts    # Configuração do Swagger
├── controllers/      # Controladores das rotas
│   └── userController.ts
├── middleware/       # Middlewares customizados
│   └── auth.ts       # Autenticação e autorização
├── models/           # Entidades do banco de dados
│   └── User.ts       # Modelo de usuário
├── routes/           # Definição das rotas
│   └── index.ts
├── services/         # Lógica de negócio
│   ├── userServices.ts # Serviços de usuário
│   └── cognitoService.ts # Serviços do AWS Cognito
├── types/            # Definições TypeScript
│   └── index.ts      # Interfaces e tipos
└── utils/            # utilitários
```

## 🔌 Endpoints

### Autenticação

| Método | Endpoint | Descrição              | Autenticação |
| ------ | -------- | ---------------------- | ------------ |
| POST   | `/auth`  | Autentica/cria usuário | Pública      |

### Usuários

| Método | Endpoint        | Descrição                  | Autenticação |
| ------ | --------------- | -------------------------- | ------------ |
| GET    | `/me`           | Obtém usuário atual        | JWT Required |
| GET    | `/users`        | Lista usuários (paginação) | Admin only   |
| PATCH  | `/edit-account` | Edita usuário              | JWT Required |

### Sistema

| Método | Endpoint  | Descrição           |
| ------ | --------- | ------------------- |
| GET    | `/health` | Health check da API |

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Registro/Login**: POST `/auth` com email, senha, nome e grupo
2. **Obtenção de Token**: A API retorna tokens JWT no response
3. **Uso do Token**: Incluir `Authorization: Bearer <token>` nos headers

### Roles e Permissões

- **admin**: Acesso completo a todos os endpoints
- **user**: Acesso apenas ao próprio perfil e edição limitada

## 💡 Exemplos de Uso

### 1. Criar/Autenticar Usuário

```bash
curl -X POST http://localhost:3000/auth \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "Senha123!",
    "group": "user"
  }'
```

### 2. Obter Informações do Usuário Logado

```bash
curl -X GET http://localhost:3000/me \
  -H "Authorization: Bearer seu_jwt_token_aqui"
```

### 3. Listar Usuários (apenas admin)

```bash
curl -X GET "http://localhost:3000/users?page=0&limit=10" \
  -H "Authorization: Bearer seu_jwt_token_aqui"
```

### 4. Editar Usuário

```bash
curl -X PATCH "http://localhost:3000/edit-account?email=joao@example.com" \
  -H "Authorization: Bearer seu_jwt_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado"
  }'
```

---

**Nota**: Esta API foi desenvolvida para demonstrar boas práticas de desenvolvimento com TypeScript, Koa.js e AWS Cognito. Adapte conforme necessário para seu caso de uso específico.
