import {NavLink} from 'react-router-dom'

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