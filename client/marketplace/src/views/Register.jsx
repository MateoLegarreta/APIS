import { useState, useEffect } from 'react'
import { Navigate, Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register, limpiarErrorAuth } from '../redux/authSlice'

function Register() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Error de validacion del formulario (antes de mandar nada)
    const [errorForm, setErrorForm] = useState('');
    const dispatch = useDispatch();
    const logueado = useSelector((state) => state.auth.token !== null);
    // Error que devolvio el back (por ejemplo, email repetido)
    const errorAuth = useSelector((state) => state.auth.error);
    const error = errorForm || errorAuth;

    // Si vino desde el login con una pagina a la que volver, se la respeta
    const location = useLocation();
    const volverA = location.state?.volverA;

    useEffect(() => {
        dispatch(limpiarErrorAuth())
    }, [dispatch])

    // Manda los datos al backend. Si sale bien, el backend devuelve un token
    // y el usuario queda con la sesion iniciada, igual que en el login
    function handleRegister() {
        setErrorForm('');

        if (!name.trim() || !surname.trim() || !nickname.trim() || !email.trim() || !password) {
            setErrorForm('Completá todos los campos');
            return;
        }

        dispatch(register({
            name: name.trim(),
            surname: surname.trim(),
            nickname: nickname.trim(),
            email: email.trim(),
            password
        }))
    }

    // Con sesion iniciada no se muestra el formulario
    if (logueado) {
        return volverA
            ? <Navigate to={volverA} replace />
            : <Navigate to="/" replace state={{ sesionIniciada: true }} />;
    }

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
                <input value={nickname}
                       placeholder= "Nombre de usuario"
                       onChange={(e) => setNickname(e.target.value)} />
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
                <Link to="/login" state={location.state} className="resumen-volver">¿Ya tenés cuenta? Iniciá sesión</Link>
            </form>
        </>
    )
}

export default Register;
