import { useState } from "react";

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

            const res = await fetch('http://localhost:3000/api/users/login', 
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
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
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
                        style={{ width: '100%' }}
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
                        style={{ width: '100%' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Ingresar</button>
            </form>
        </div>
    );
}