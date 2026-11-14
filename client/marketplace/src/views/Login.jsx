import { useState, useEffect } from 'react'
import { Navigate, Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, limpiarError } from '../redux/userSlice'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const logueado = useSelector((state) => state.user.token !== null);
    const { loading, error } = useSelector((state) => state.user);

    // Si llego aca porque quiso agregar al carrito sin sesion, viene un aviso
    // y la pagina a la que hay que devolverlo despues de entrar
    const location = useLocation();
    const aviso = location.state?.aviso;
    const volverA = location.state?.volverA;

    // Si quedo un error de antes (por ejemplo del registro) no se muestra aca
    useEffect(() => {
        dispatch(limpiarError())
    }, [dispatch])

    // Pide el token al backend. Si las credenciales estan bien, el slice lo
    // guarda y la pantalla se redirige sola al catalogo
    function handleLogin() {
        dispatch(login({ email: email.trim(), password }))
    }

    // Con sesion iniciada no se muestra el formulario: vuelve a donde estaba
    // o, si entro directo al login, al inicio
    if (logueado) {
        return volverA
            ? <Navigate to={volverA} replace />
            : <Navigate to="/" replace state={{ sesionIniciada: true }} />;
    }

    return (
        <>
            <h1 className="titulo-seccion">Iniciar sesión</h1>
            <form className="form-caja" onSubmit={(e) => e.preventDefault()}>
                {aviso && !error && <p className="aviso">{aviso}</p>}
                {error && <p className="mensaje-error">{error}</p>}
                <input value={email}
                       type="email"
                       placeholder="Email"
                       onChange={(e) => setEmail(e.target.value)} />
                <input value={password}
                       type="password"
                       placeholder="Contraseña"
                       onChange={(e) => setPassword(e.target.value)} />
                <button className="boton" onClick={handleLogin} disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
                <Link to="/register" state={location.state} className="resumen-volver">¿No tenés cuenta? Registrate</Link>
            </form>
        </>
    )
}

export default Login;
