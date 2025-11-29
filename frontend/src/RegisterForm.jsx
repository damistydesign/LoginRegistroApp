import { useState } from "react"

export const RegisterForm = ({ onUserCreated }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        username: '',
        password: ''
    })

    const [errors, setErrors] = useState([])

    const handleChange = (e) => {
        const input = e.target;
        //console.log(input)
           
        setFormData({
            ...formData,
            [input.name]: input.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{

           const res = await fetch("http://localhost:3000/api/users", 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            )

            const data = await res.json();

            if(!res.ok){
                const errorArray = data.error?.map(msg => ({ message: msg })) || [{ message: 'Error desconocido' }]; setErrors(errorArray);
                return;
            }

            // console.log('Usuario Creado: ', data)
            
            setFormData({
                nombre: '',
                email: '',
                username: '',
                password: ''
            })
            
            setErrors([])
            onUserCreated(data)
            
        }catch(e){
            console.error('Ocurrió un error de red: ', e)
            setErrors([{ message: 'Ocurrió un error al comunicarse con el servidor.'}])
        }
    }

    /*
        useEffect(() => {
            console.log('Datos: ', formData)
        }, [formData])
    */

    return(
        <>
        {errors.length > 0 && (
                <div className="error_container">
                    <h3>Error al crear usuario:</h3>
                    <ul>
                        { errors.map((err, index) => (
                            <li key={index}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="form__container">
                <h2>Registrarse</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email" required value={formData.email}  onChange={handleChange}/>

                    <label htmlFor="username">Nombre de usuario:</label>
                    <input type="text" id="username" name="username" required value={formData.username}  onChange={handleChange}/>

                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required value={formData.nombre}  onChange={handleChange}/>

                    <label htmlFor="password">Contraseña: </label>
                    <input type="password" name="password" id="password" required value={formData.password}  onChange={handleChange} />
                    <button type="submit">Crear</button>
                </form>
            </div>
        </>
    )
}