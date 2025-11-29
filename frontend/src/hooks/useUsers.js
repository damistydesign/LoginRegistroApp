import { useState, useEffect } from 'react'

export const useUsers = (token) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Si hay token -> Busca los usuarios.
  // Si no hay token -> Limpia la lista.
  useEffect(() => {
    
    if (!token) {
      setUsers([])
      return;
    } 
      setLoading(true)

      fetch(import.meta.env.VITE_BACKEND_URL, {
        headers: {
          'Authorization': `Bearer ${token}` // ¡Acá viaja el carnet!
        }
      })
      .then(res => {
        if(!res.ok) throw new Error ("Error al cargar los usuarios");
        return res.json()
      })
      .then(data => {
        setUsers(data)
        setError(null)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => {
        setLoading(false); // Terminamos, por más que sea exito o error
      })

  }, [token]) // <-- Se ejecuta cada vez que cambia 'token'


  // Retornamos lo que el componente App necesita
  return { users, setUsers, loading, error }
}