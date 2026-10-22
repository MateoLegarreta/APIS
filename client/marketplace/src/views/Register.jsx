import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {  Navigate, Link } from 'react-router-dom'


function Register() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { logueado, login, logout } = useAuth();
    

    // Manda los datos al backend. Si sale bien, el backend devuelve un token
    // y el usuario queda con la sesion iniciada, igual que en el login
    function handleRegister() {
        setError('');

        if (!name.trim() || !surname.trim() || !email.trim() || !password) {
            setError('Completá todos los campos');
            return;
        }

        fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                name: name.trim(),
                surname: surname.trim(),
                email: email.trim(),
                password
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    // El backend responde 400 cuando el email ya esta registrado
                    if (response.status === 400) {
                        throw new Error('Ya existe un usuario con ese email');
                    }
                    throw new Error('Error en el registro');
                }
            })

            .catch(error => {
                setError(error.message);
                console.error(error);
            });
            
            
            
           
    }

    // Con sesion iniciada no se muestra el formulario
    if (logueado) return <Navigate to="/" replace state={{ sesionIniciada: true }} />;

    return (
        <>
            <h1 className="titulo-seccion">Registrarse</h1>
            <form className="form-caja" onSubmit={(e) => e.preventDefault()}>
                {error && <p className="mensaje-error">{error}</p>}
                
                <input value={name}
                       type="text"
                       placeholder="Nombre"
                       onChange={(e) => setName(e.target.value)} />
                <input value={surname}
                        type="text"
                       placeholder="Apellido"
                       onChange={(e) => setSurname(e.target.value)} />
                <input value={email}
                       type="email"
                       placeholder="Email"
                       onChange={(e) => setEmail(e.target.value)} />
                <input value={password}
                       type="password"
                       placeholder="Contraseña"
                       onChange={(e) => setPassword(e.target.value)} />
                <button className="boton" onClick={handleRegister}>
                    Registrarse
                </button>
                <Link to="/login" className="resumen-volver">¿Ya tenés cuenta? Iniciá sesión</Link>
            </form>
        </>
    )
}

export default Register;
