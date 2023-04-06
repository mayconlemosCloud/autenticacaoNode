import express from "express";
import morgan from "morgan";
import router from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.json";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
app.use(morgan("tiny"));
app.use(router);

// Middleware para servir a documentação da API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
