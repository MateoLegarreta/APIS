import { useState } from 'react'


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // Al arrancar (por ejemplo despues de un F5) se mira si ya hay un token guardado,
    // en vez de asumir que no hay sesion. La funcion se ejecuta una sola vez
    const [logueado, setLogueado] = useState(() => Boolean(localStorage.getItem('token')))

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
                localStorage.setItem('token', data.access_token);
                setLogueado(true);
            })
            .catch(error => {
                setError(error.message);
                console.error(error);
            }); }

    // Borra el token guardado y vuelve a mostrar el formulario
    function handleLogout() {
        localStorage.removeItem('token');
        setLogueado(false);
    }

    // Con sesion iniciada ya no se muestra el formulario
    if (logueado) {
        return (
            <>
                <p>Sesión iniciada</p>
                <button onClick={handleLogout}>Cerrar sesión</button>
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
