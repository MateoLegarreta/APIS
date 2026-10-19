import { useState } from 'react'
import { useAuth } from '../context/AuthContext'


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
            .then(data => {
                login(data.access_token);
            })
            .catch(error => {
                setError(error.message);
                console.error(error);
            }); }

    // Con sesion iniciada no se muestra el formulario
    if (logueado) {
        return (
            <>
                <p>Sesión iniciada</p>
                <button onClick={logout}>Cerrar sesión</button>
            </>
        )
    }

    return (
        <>
            {error && <p>{error}</p>}
            <form onSubmit={(e) =>  e.preventDefault()}>
                <input value={email}
                       onChange={(e) => setEmail(e.target.value)} />
                <input value={password}
                       type="password"
                       onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleLogin}>
                    Entrar
                </button>
             </form>
        </>
    )
}

export default Login;
