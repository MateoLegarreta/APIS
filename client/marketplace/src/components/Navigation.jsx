import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/userSlice'
import { fetchCart } from '../redux/cartSlice'
import { fetchCategories } from '../redux/categorySlice'
import { IconoBuscar, IconoCarrito, IconoUsuario } from './Iconos'

// Barra de navegacion en dos pisos: arriba la marca, el buscador y la cuenta;
// abajo las categorias. Queda fija arriba al scrollear (position: sticky)
function Navigation() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const logueado = useSelector((state) => state.user.token !== null)
  const esAdmin = useSelector((state) => state.user.rol === 'ADMIN')
  const { items, cargado } = useSelector((state) => state.cart)
  const categorias = useSelector((state) => state.categories.items)
  const categoriasCargadas = useSelector((state) => state.categories.cargado)

  // Arranca con lo que se busco, asi el texto no se borra al llegar al catalogo
  const [busqueda, setBusqueda] = useState(searchParams.get('buscar') ?? '')

  // reduce recorre las lineas sumando sus cantidades: dos botellas de una
  // y tres de otra son cinco unidades, no dos lineas
  const cantidad = items.reduce((suma, item) => suma + item.quantity, 0)

  // El carrito se pide una sola vez, al iniciar sesion. Despues se mantiene
  // actualizado solo, con lo que devuelve cada accion del carrito.
  // El admin no compra, asi que no tiene carrito que pedir
  useEffect(() => {
    if (logueado && !esAdmin && !cargado) {
      dispatch(fetchCart())
    }
  }, [logueado, dispatch])

  // Las categorias del segundo piso. Son las mismas del catalogo: se piden una vez
  useEffect(() => {
    if (!categoriasCargadas) {
      dispatch(fetchCategories())
    }
  }, [categoriasCargadas, dispatch])

  // La busqueda viaja en la URL (/catalogo?buscar=malbec) y el catalogo la lee de ahi
  function buscar(e) {
    e.preventDefault()
    const texto = busqueda.trim()
    navigate(texto ? '/catalogo?buscar=' + encodeURIComponent(texto) : '/catalogo')
  }

  // Cierra la sesion y lleva al login. logout tambien vacia el carrito del store
  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-piso">
        <Link to="/" className="navbar-marca">La Bodega</Link>

        <form className="buscador" role="search" onSubmit={buscar}>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscá un malbec, una IPA, un gin..."
            aria-label="Buscar productos" />
          <button type="submit" aria-label="Buscar">
            <IconoBuscar tamanio={18} />
          </button>
        </form>

        <nav className="navbar-cuenta" aria-label="Cuenta">
          {esAdmin && <Link to="/admin/products" className="navbar-link">Panel</Link>}

          {logueado && !esAdmin && <Link to="/pedidos" className="navbar-link">Mis pedidos</Link>}

          {logueado
            ? <button type="button" className="navbar-link" onClick={handleLogout}>Salir</button>
            : (
              <Link to="/login" className="navbar-link navbar-ingresar">
                <IconoUsuario tamanio={20} /> Ingresar
              </Link>
            )}

          {/* El admin no compra: administra. Por eso no ve el carrito */}
          {!esAdmin && (
            <Link to="/carrito" className="navbar-carrito" aria-label={'Carrito, ' + cantidad + ' productos'}>
              <IconoCarrito />
              {cantidad > 0 && <span className="navbar-contador">{cantidad}</span>}
            </Link>
          )}
        </nav>
      </div>

      <nav className="navbar-categorias" aria-label="Categorías">
        <div className="navbar-categorias-interior">
          {/* "Todo" se marca en el catalogo sin categoria elegida */}
          <Link to="/catalogo"
                className={location.pathname === '/catalogo' && !searchParams.get('categoria') ? 'active' : ''}>
            Todo
          </Link>
          {categorias.map((categoria) => (
            <Link key={categoria.id} to={'/catalogo?categoria=' + categoria.id}
                  className={searchParams.get('categoria') === String(categoria.id) ? 'active' : ''}>
              {categoria.description}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navigation
