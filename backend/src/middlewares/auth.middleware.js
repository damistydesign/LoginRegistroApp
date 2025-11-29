import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    // 1. Obtenemos el header completo (ej: "Bearer eyJ...")
    const authHeader = req.headers['authorization'];
    
    // 2. Extraemos el token.
    // authHeader && ... es un chequeo de seguridad:
    // "Si existe authHeader, hacé el split, sino devolvé undefined"
    const token = authHeader && authHeader.split(' ')[1];

    // 3. Si no hay token, 401 (No tienes pase)
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token requerido.' });
    }

    try {
        // 4. Verificamos.
        // OJO: jwt.verify LANZA un error si el token es falso o expiró.
        // Por eso no hace falta el "if(!verifiedToken)", el try/catch lo atrapa.
        const user = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Inyectamos al usuario en la petición
        // ¡Esto es clave! Ahora los controladores saben quién sos.
        req.user = user;

        // 6. Pasamos al siguiente
        next();

    } catch (e) {
        // Si jwt.verify falla (token vencido o trucho), cae acá.
        // 403 Forbidden = "Tu pase no es válido"
        console.error('Error de token:', e.message);
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};