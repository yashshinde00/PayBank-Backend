import express from 'express';
import mainRouter from "./routes/indexRoutes";
import dotenv from "dotenv";
import cors from "cors";
import { Client } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = new Client({
  connectionString: dbUrl,
});

client.connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

app.use(cors({
      origin: ["http://localhost:5173"]
      }));
app.use(express.json());

app.use(mainRouter);

app.listen(PORT, () => {
  console.log(`Port is running at ${PORT}`);
});
