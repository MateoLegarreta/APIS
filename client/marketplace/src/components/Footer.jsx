import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Pie de pagina. Se ve en todas las pantallas porque va fuera de las Routes,
// igual que la barra de navegacion
function Footer() {
    const { logueado } = useAuth()

    // El año sale solo, asi no hay que acordarse de tocarlo en enero
    const anio = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="footer-columnas">

                <div>
                    <h3>Navegación</h3>
                    <ul>
                        <li><Link to="/">Catálogo</Link></li>
                        {logueado && <li><Link to="/carrito">Mi carrito</Link></li>}
                        {logueado && <li><Link to="/pedidos">Mis pedidos</Link></li>}
                        {!logueado && <li><Link to="/login">Iniciar sesión</Link></li>}
                        {!logueado && <li><Link to="/register">Crear cuenta</Link></li>}
                    </ul>
                </div>

                <div>
                    <h3>La tienda</h3>
                    <p>
                        Vinos, cervezas, destilados y aperitivos.
                        Más de veinte etiquetas seleccionadas.
                    </p>
                </div>

                <div>
                    <h3>Contactanos</h3>
                    <p className="footer-dato">📧 contacto@labodega.com.ar</p>
                    <p className="footer-dato">📞 11 5555-5555</p>
                    <p className="footer-dato">📍 Lima 717, CABA</p>
                </div>

                <div>
                    <h3>Horarios</h3>
                    <p className="footer-dato">Lunes a viernes de 10 a 21</p>
                    <p className="footer-dato">Sábados de 10 a 15</p>
                </div>

            </div>

            <div className="footer-abajo">
                <div className="footer-abajo-interior">
                    <span>© {anio} La Bodega. Trabajo práctico — UADE.</span>
                    <span>Beber con moderación. Prohibida su venta a menores de 18 años.</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
