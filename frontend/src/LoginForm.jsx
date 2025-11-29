import { useState } from "react";
import './css/form.css'

export const LoginForm = ({ onLoginSuccess }) => {
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const [error, setErrors] = useState(null)

    const handleChange = (e) => {
        const input = e.target;
        
        setData({
            ...data,
            [input.name]: input.value
        })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null)

        try{

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, 
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            )

            const responseData = await res.json();

            if(!res.ok){
                setErrors( responseData || { 'error': 'Ocurrió un error al iniciar sesión.' })
                return
            }

            setData({
                email: '',
                password: ''
            })

            setErrors('')

            localStorage.setItem('token', responseData.token)

            onLoginSuccess(responseData.token) // avisamos al padre
        }catch(e){
            setErrors({ 'error': 'Error de conexión con el servidor' })
            console.error(e)
        }
    }

return (
        <div className="form__container">
            <h2>Iniciar Sesión</h2>
            
            {/* Mostramos el error si existe, pero SIN borrar el form */}
            {error && <p style={{ color: 'red' }}>{error.error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={data.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={data.password} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
}