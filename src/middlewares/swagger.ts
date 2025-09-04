// src/middlewares/swagger-koa.ts
import { koaSwagger } from "koa2-swagger-ui";
import swaggerJSDoc from "swagger-jsdoc";
import { options } from "../config/swagger.js";

const swaggerSpec = swaggerJSDoc(options);

export const swaggerUi = koaSwagger({
  routePrefix: "/api-docs",
  swaggerOptions: {
    spec: swaggerSpec as any,
  },
  hideTopbar: true,
});
