import type { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "User Management API",
    version: "1.0.0",
    description:
      "API para gerenciamento de usuários com autenticação AWS Cognito",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        required: ["name", "email", "password", "group"],
        properties: {
          name: {
            type: "string",
            example: "João Silva",
          },
          email: {
            type: "string",
            format: "email",
            example: "joao@example.com",
          },
          password: {
            type: "string",
            description:
              "Deve conter: 1 letra maiúscula, 1 minúscula, 1 número, 1 caractere especial e mínimo 8 caracteres",
            example: "Senha123!",
          },
          group: {
            type: "string",
            enum: ["admin", "user"],
            example: "user",
          },
        },
      },
      UserUpdate: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "João Silva Updated",
          },
          group: {
            type: "string",
            enum: ["admin", "user"],
            example: "admin",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          AccessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          ExpiresIn: {
            type: "number",
            example: 3600,
          },
          TokenType: {
            type: "string",
            example: "Bearer",
          },
          RefreshToken: {
            type: "string",
            example: "abcdef123456...",
          },
          IdToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Mensagem de erro",
          },
        },
      },
      PaginatedUsers: {
        type: "object",
        properties: {
          users: {
            type: "array",
            items: {
              $ref: "#/components/schemas/User",
            },
          },
          morePages: {
            type: "boolean",
            example: true,
          },
        },
      },
    },
  },
  paths: {
    "/auth": {
      post: {
        summary: "Autentica ou cria um novo usuário",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                name: "João Silva",
                email: "joao@example.com",
                password: "Senha123!",
                group: "user",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Autenticação bem-sucedida",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          400: {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/me": {
      get: {
        summary: "Obtém informações do usuário logado",
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Informações do usuário",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "number", example: 1 },
                    email: { type: "string", example: "joao@example.com" },
                    name: { type: "string", example: "João Silva" },
                    role: { type: "string", example: "user" },
                    isOnboarded: { type: "boolean", example: false },
                  },
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        summary: "Lista todos os usuários (apenas admin)",
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              minimum: 0,
              example: 0,
            },
            required: true,
            description: "Número da página (começa em 0)",
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              minimum: 1,
              example: 10,
            },
            required: true,
            description: "Limite de itens por página",
          },
        ],
        responses: {
          200: {
            description: "Lista de usuários paginada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedUsers",
                },
              },
            },
          },
          400: {
            description: "Parâmetros de paginação inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          403: {
            description: "Permissões insuficientes",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/edit-account": {
      patch: {
        summary: "Edita informações do usuário",
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "email",
            schema: {
              type: "string",
              format: "email",
              example: "joao@example.com",
            },
            required: true,
            description: "Email do usuário a ser editado",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserUpdate",
              },
              example: {
                name: "João Silva Updated",
                group: "admin",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          403: {
            description: "Permissões insuficientes",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          404: {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          500: {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        summary: "Health check da API",
        tags: ["System"],
        responses: {
          200: {
            description: "API está funcionando",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "OK",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const options: OAS3Options = {
  swaggerDefinition,
  apis: [], // Não precisa de arquivos adicionais
};

export { swaggerDefinition, options };
