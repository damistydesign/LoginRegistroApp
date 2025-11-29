import { useState, useEffect } from 'react'
import './App.css'
import { UserForm } from './UserForm'
import { LoginForm } from './LoginForm'

function App() {
  const [users, setUsers] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  // Nuevo estado: ¿Muestro el registro o el login?
  const [showRegister, setShowRegister] = useState(false) 

  // ESTO es lo que arreglamos. Un useEffect que reacciona al Token.
  // Si hay token -> Busca los usuarios.
  // Si no hay token -> Limpia la lista.
  useEffect(() => {
    if (token) {
      fetch(import.meta.env.VITE_BACKEND_URL, {
        headers: {
          'Authorization': `Bearer ${token}` // ¡Acá viaja el carnet!
        }
      })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err))
    } else {
      setUsers([]) // Si no hay token, vaciamos la lista por seguridad
    }
  }, [token]) // <-- Se ejecuta cada vez que cambia 'token'

  // Cuando el registro es exitoso:
  const handleUserCreated = (usuarioNuevo) => {
    // Agregamos al usuario y cerramos el formulario de registro
    setUsers(prev => [...prev, usuarioNuevo])
    alert("Usuario creado con éxito. Ahora podés ver la lista.")
    // Opcional: Podrías hacer que se loguee automáticamente acá si quisieras
  }

  // Cuando el login es exitoso:
  const handleLoginSuccess = (newToken) => {
    setToken(newToken) // Esto dispara el useEffect de arriba 👆
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    setToken(null)
    setShowRegister(false) // Volver al login por defecto
  }

  // --- RENDERIZADO ---

  // 1. Si NO hay token, mostramos Login o Registro
  if (!token) {
    return (
      <div className="auth-container">
        {showRegister ? (
          <>
            <UserForm onUserCreated={handleUserCreated} />
            <p>¿Ya tenés cuenta? <button onClick={() => setShowRegister(false)}>Iniciar Sesión</button></p>
          </>
        ) : (
          <>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
            <p>¿No tenés cuenta? <button onClick={() => setShowRegister(true)}>Registrate</button></p>
          </>
        )}
      </div>
    )
  }

  // 2. Si HAY token, mostramos la App protegida
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Panel de Usuarios (Privado)</h1>
        <button onClick={cerrarSesion} style={{ background: 'red' }}>Cerrar Sesión</button>
      </div>

      <ul>
        {users.length > 0 ? (
           users.map(user => (
            <li key={user.id}> 
              <strong>{user.username}</strong> <small>({user.email})</small>
            </li>
          ))
        ) : (
          <p>Cargando usuarios o lista vacía...</p>
        )}
      </ul>
      
      {/* Opcional: Si querés seguir agregando usuarios estando logueado,
         podés dejar el UserForm acá abajo también. 
      */}
    </>
  )
}

export default App;