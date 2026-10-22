import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {  Navigate, Link } from 'react-router-dom'



function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { logueado, login, logout } = useAuth();
    
    

    function handleLogin() {
        setError('');
        fetch('/api/v1/auth/authenticate', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email:email.trim(), password }) 
        } )
            .then(response =>{
                if(response.ok){
                    return response.json();
                }
                else{
                    if(response.status === 403){
                        throw new Error('Usuario o contraseña incorrectos');
                    }
                    throw new Error('Error en la autenticación');
                }
            })

             .catch(error => {
                setError(error.message);
                console.error(error);
            }); }
            
            
            
          
    // Con sesion iniciada no se muestra el formulario
    if (logueado) return <Navigate to="/" replace state={{ sesionIniciada: true }} />;

    return (
        <>
            
            <h1 className="titulo-seccion">Iniciar Sesión</h1>
            <form className="form-caja" onSubmit={(e) =>  e.preventDefault()}>
                {error && <p className="mensaje-error">{error}</p>}
                <input value={email} 
                       type="email" 
                       placeholder="Email"
                       onChange={(e) => setEmail(e.target.value)} />
                <input value={password}
                       type="password"
                       placeholder="Contraseña"
                       onChange={(e) => setPassword(e.target.value)} />
                <button className="boton" onClick={handleLogin}>
                    Entrar
                </button>
                <Link to="/register" className="resumen-volver">¿No tenés cuenta? Registrate</Link>
             </form>
        </>
    )
}

export default Login;
