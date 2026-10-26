import {NavLink} from 'react-router-dom'

// Menu de las cuatro secciones del panel. NavLink le pone la clase "active"
// al link de la pantalla en la que estas
function MenuAdmin(){
    return(
        <nav className='menu-admin'>
            <NavLink to="/admin/products">Productos</NavLink>
            <NavLink to="/admin/categories">Categorias</NavLink>
            <NavLink to="/admin/sales">Ventas</NavLink>
            <NavLink to="/admin/users">Usuarios</NavLink>
        </nav>
    )
}
export default MenuAdmin