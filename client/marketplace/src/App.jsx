import './App.css'
import { Home } from './views/Home'
import Navigation from './components/Navigation'
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom'
import Contact from './views/Contact'
import ExampleComponent from './components/ExampleComponent'
import PostList from './components/PostList'
import Catalogo from './components/Catalogo'
import Login from './components/Login'



function App() {
//   const navigate = useNavigate()
//   const location = useLocation()

// const handleClick = () =>{
//   navigate('/contact')
// }
  return (
  
  <>
  <Login />
  <Catalogo />
  {/* <ExampleComponent /> */}
  {/* <Navigation />
  <Routes>
    <Route path='/home' element={<Home />}/>
    <Route path='/contact' element={<Contact />}/>
  </Routes>
  <button onClick={handleClick}>Contacto</button>
  <p>La ruta actual es: {location.pathname}</p> */}
  </>
 
  )
}

export default App
