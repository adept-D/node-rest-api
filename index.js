import express from "express";
import router from "./server/routes/routes.js"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from 'cors';
import errorMiddleware from './server/middlewares/errorMiddleware.js';
import authMiddleware from "./server/middlewares/authMiddleware.js";

dotenv.config()

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/",router);
// app.use(authMiddleware);
app.use(errorMiddleware);

async function startServer(){
    try {
        app.listen(PORT, () => {
            console.log("Server is listening... on PORT: ", PORT);
        })
    } catch (error) {
        console.log(error);
    }
}

await startServer();