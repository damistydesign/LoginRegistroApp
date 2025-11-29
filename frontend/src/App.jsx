import { useState } from 'react'
import './App.css'
import { useUsers } from './hooks/useUsers'
import { jwtDecode } from 'jwt-decode'
import { UsersPanel } from './components/UsersPanel'
import { ShowLogin } from './components/ShowLogin'
import { ShowRegister } from './components/ShowRegister'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const { users, setUsers, loading, error } = useUsers(token);
  const [showRegister, setShowRegister] = useState(false);

  // Cuando el registro es exitoso:
  const handleUserCreated = (usuarioNuevo) => {
    // Agregamos al usuario y cerramos el formulario de registro
    setUsers(prev => [...prev, usuarioNuevo])
    alert("Usuario creado con éxito. Ahora podés ver la lista.")
    // Opcional: Podrías hacer que se loguee automáticamente acá si quisieras
  }

  // Cuando el login es exitoso:
  const handleLoginSuccess = (newToken) => {
    setToken(newToken) // Esto dispara el useEffect
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
          <ShowRegister handleUserCreated={handleUserCreated} setShowRegister={setShowRegister}/>
        ) : (
          <ShowLogin setShowRegister={setShowRegister} handleLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    )
  }

  // Si hay errores
  if(error){
    return(
      <h1>Ups ocurrió un error</h1>
    )
  }

  // Mensaje de carga
  if(loading) return <h1>Cargando...</h1>

  const decodedToken = jwtDecode(token)

  // 2. Si HAY token, mostramos la App protegida
  return (
    <>
     { // decodificamos el token, y accedemos a la propiedad isAdmin que almacena true o false
      decodedToken.isAdmin > 0 && <h2 className='admin__welcome'>Bienvenido, Admin</h2> || null
    }
      <UsersPanel cerrarSesion={cerrarSesion} users={users} />
    </>
  )

  
}

export default App;