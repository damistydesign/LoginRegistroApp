import { Router } from "express";
import { pool } from "../models/db.js";

export const indexRouter = Router();

indexRouter.get('/ping', (req, res) => {
    res.send('Pong')
})

indexRouter.get('/testDB', async (req, res) => {
    try{
        const [respuesta] =  await pool.query(
            `SELECT 1 + 1 AS resultado`
        )
        return res.send(respuesta)
    }catch(e){
        console.error('Ocurrió un error al testear la Base de Datos:', e)
        return res.status(500).json({ error: 'Occurrió un error insesperado al conectar con la BD.' });
    }
})