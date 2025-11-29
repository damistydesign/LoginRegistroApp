import express from "express";
import 'dotenv/config';
// import { indexRouter } from "./routes/index.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { acceptedOrigins } from "./middlewares/cors.js";
import cors from 'cors';

const app = express();
app.use(cors(acceptedOrigins))

app.use(express.json());
app.disable('x-powered-by');

const port = process.env.PORT;

app.use('/api/users', usersRouter)

app.listen(port, () =>{
    console.log(`Servidor corriendo en http://localhost:${port}`)
})