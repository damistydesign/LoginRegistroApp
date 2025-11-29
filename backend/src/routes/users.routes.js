import { Router } from "express";
import { UsersController } from "../controllers/users.controllers.js";
import { validateSchema } from "../middlewares/validateSchemas.js";
import { createUserSchema, updateUserSchema, userLoginSchema } from "../schemas/user.schemas.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

export const usersRouter = Router();

// Obtener los usuarios
usersRouter.get('/', authenticateToken, UsersController.getUsuario)

// Crear un usuario
usersRouter.post('/', validateSchema(createUserSchema), UsersController.createUsuario)

// Eliminar un usuario
usersRouter.delete('/:id', authenticateToken, UsersController.deleteUsuario)

// Actualizar info de un usuario
usersRouter.put('/:id', authenticateToken, validateSchema(updateUserSchema), UsersController.updateUsuario)

// Login del usuario
usersRouter.post('/login', validateSchema(userLoginSchema), UsersController.loginUsuario)