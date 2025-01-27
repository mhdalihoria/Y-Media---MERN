import mongoose from "mongoose";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
  })
);

app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});


// mongo connection
function connect() {
    mongoose.connection.on("connected", () => console.log("DB connected"));
    mongoose.connection.on("error", (error) => console.log("DB Error", error));
  
    return mongoose.connect(process.env.MONGO_URI || "");
  }
  
  connect();
app.listen(port, () => {
  console.log(`Server running @ http://localhost:${port}`);
});
