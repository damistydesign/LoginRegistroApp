import { pool } from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export class UsersController {
  // Obtiene los usuarios
  static async getUsuario(req, res) {
    try {
      const [users] = await pool.query("SELECT * FROM users.usuarios");
      return res.json(users);
    } catch (e) {
      console.error("Ocurrió un error al obtener los usuarios: ", e);
      res
        .status(500)
        .json({ error: "Ocurrió un error al obtener los usuarios" });
    }
  }

  // Crea un usuario
  static async createUsuario(req, res) {
    // acá se almacena el hash de la contraseña
    try {
      const { nombre, email, username, password } = req.body;
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const [resultado] = await pool.query(
        `
          INSERT INTO usuarios (nombre, email, username, password) VALUES(?, ?, ?, ?)`,
        [nombre, email, username, passwordHash]
      );

      const nuevoUsuario = {
        id: resultado.insertId,
        nombre,
        email,
        username,
      };

      console.log(nuevoUsuario);
      res.status(201).json(nuevoUsuario);
    } catch (e) {
      console.error("Ocurrió un error al crear el usuario: ", e);
      res
        .status(500)
        .json({ message: "Ocurrió un error interno al crear el usuario" });
    }
  }

  // Elimina un usuario
  static async deleteUsuario(req, res) {
    // Lógica para eliminar el usuario

    try{
      const { id } = req.params;
      const [resultado] = await pool.query(`
          DELETE FROM usuarios WHERE id = ?
        `,[id])
      
      if(resultado.affectedRows > 0){
        return res.sendStatus(204)
      }else{
        return res.status(404).json({ "error": 'Usuario no encontrado'})
      }
    } catch(e){
        console.error('Ocurrió un error en la consulta: ', e)
        res.status(500).json({ "error": 'Ocurrió un error inesperado' })
    } 
  }

  // Actualiza info de un usuario
  static async updateUsuario(req, res) {
    // Lógica para actualizar info del usuario
    try{
      // console.log(req.body, req.params) <- handler nomás
      const { id } = req.params;
      const {
        nombre,
        username,
        email,
        password
      } = req.body

      let passwordHash;

      if(password && password.length > 0){
        const saltRounds = 10

        passwordHash = await bcrypt.hash(password, saltRounds)
        // console.log(passwordHash) <- handler nomás
      }

      // console.log({id, nombre, username, email, passwordHash}) <- handler nomás

      const [resultado] = await pool.query(`
          UPDATE usuarios SET nombre = IFNULL(?, nombre), username = IFNULL(?, username),
          email = IFNULL(?, email), password = IFNULL(?, password) WHERE id = ?;
        `
        , [nombre, username, email, passwordHash, id])

        if(resultado.affectedRows > 0){
          const usuarioActualizado = await pool.query(`SELECT * FROM usuarios WHERE id = ?`, [id])

          res.status(200).json(usuarioActualizado[0])
        }else{
          res.status(404).json({ "error": 'Usuario no encontrado' })
        }
    }catch(e){
      res.status(500).json({ "error": 'Ocurrió un error inesperado al actualizar el usuario: ', e})
    }
  }

  // Loggear al usuario
  static async loginUsuario(req, res){
      try {
          const { email, password } = req.body

          // 1. Buscamos el usuario
          const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email])
          const user = users[0]; // Lo sacamos del array para que sea más cómodo

          // 2. CHECK 1: ¿Existe el usuario?
          // Si NO existe, cortamos acá.
          if(!user){
              return res.status(401).json({ error: 'Usuario y/o contraseña incorrectos' });
          }

          // 3. CHECK 2: ¿Coincide la contraseña?
          const passwordIsCorrect = await bcrypt.compare(password, user.password);
          
          // Si NO coincide, cortamos acá.
          if(!passwordIsCorrect){
              return res.status(401).json({ error: 'Usuario y/o contraseña incorrectos' });
          }

          // 4. ¡ÉXITO!
          // (Si el código llegó hasta acá, es porque pasó los dos filtros anteriores)
          
          // Nota: 200 OK es mejor que 201 Created para Login (a menos que crees una sesión en BD)
          const token = jwt.sign({ id: user.id, username: user.username  }, process.env.JWT_SECRET, {expiresIn: '1h'})
          res.status(200).json({ 
              token: token, username: user.username

              // user: { id: user.id, username: user.username } // Opcional: devolver datos útiles
          });

      } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Ocurrió un error interno al intentar loggear' })
      }
    }
}
