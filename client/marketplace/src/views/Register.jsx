import { useState } from 'react'
import { useAuth } from '../context/AuthContext'


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
            .then(data => {
                login(data.access_token);
            })
            .catch(error => {
                setError(error.message);
                console.error(error);
            });
    }

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
            <form onSubmit={(e) => e.preventDefault()}>
                <input value={name}
                       placeholder="Nombre"
                       onChange={(e) => setName(e.target.value)} />
                <input value={surname}
                       placeholder="Apellido"
                       onChange={(e) => setSurname(e.target.value)} />
                <input value={email}
                       placeholder="Email"
                       onChange={(e) => setEmail(e.target.value)} />
                <input value={password}
                       type="password"
                       placeholder="Contraseña"
                       onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleRegister}>
                    Registrarse
                </button>
            </form>
        </>
    )
}

export default Register;
