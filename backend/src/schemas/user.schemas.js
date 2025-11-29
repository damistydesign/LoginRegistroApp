import z from 'zod';

export const createUserSchema = z.object({
    nombre: z.string().min(5, {
        message: "El nombre es debe de ser de al menos 5 caracteres."
    }),
    email: z.email({
        message: "Ingresa un email válido."
    }),
    username: z.string().min(4, {
        message: 'El nombre de usuario debe tener al menos 4 caracteres.'
    }),
    password: z.string().min(8, {
        message: 'La contraseña debe tener mínimo 8 caracteres.'
    })
})

export const userLoginSchema = z.object({
    email: z.email({
        message: "Ingresa un email válido."
    }),
    password: z.string().min(8, {
        message: 'La contraseña mínima debe tener 8 caracteres.'
    })
})

export const updateUserSchema = createUserSchema.partial();