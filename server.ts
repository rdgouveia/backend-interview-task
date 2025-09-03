import Koa from "koa";
import dotenv from "dotenv";
import { AppDataSource } from "./src/config/database.js";

dotenv.config();
const app = new Koa();

app.use(async (ctx, next) => {
  if (ctx.path === "/health") {
    ctx.body = { status: "OK" };
    return;
  }
  await next();
});

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

export default app;
