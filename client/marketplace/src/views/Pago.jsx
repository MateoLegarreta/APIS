import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkout } from '../redux/cartSlice'
import { precio } from '../utils/precio'

// Tarjetas de prueba "guardadas" del usuario. Son numeros de prueba que no
// sirven para pagar de verdad: el pago es simbolico
const TARJETAS = [
    { id: 'visa', nombre: 'Visa terminada en 1111', titular: 'Juan Perez', numero: '4111 1111 1111 1111', vencimiento: '12/28', cvv: '123' },
    { id: 'master', nombre: 'Mastercard terminada en 4444', titular: 'Juan Perez', numero: '5555 5555 5555 4444', vencimiento: '09/27', cvv: '456' },
]

function Pago() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {items, total, cargado} = useSelector((state) => state.cart)

    const [error, setError] = useState('')
    const [ocupado, setOcupado] = useState(false)

    const [titular, setTitular] = useState('')
    const [numero, setNumero] = useState('')
    const [vencimiento, setVencimiento] = useState('')
    const [cvv, setCvv] = useState('')

    // 'otra' = el usuario escribe una tarjeta nueva
    const [elegida, setElegida] = useState('otra')

    function confirmarCompra() {
          setError('')
          setOcupado(true)
          dispatch(checkout())
              .unwrap()
              .then(pedido => {
                  navigate('/pedidos/' + pedido.id, { state: { recienCreado: true } })
              })
              .catch(error => {
                  setError(error.message)
                  setOcupado(false)
              })
      }

    function validarTarjeta(){
        const soloNumeros = numero.replace(/\s/g, '')

        if(titular.trim() === '') return 'Completá el nombre del titular'
        if (!/^\d{16}$/.test(soloNumeros)) return 'El número de tarjeta debe tener 16 dígitos'
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento)) return 'El vencimiento debe tener el formato MM/AA'

        const [mes, anio] = vencimiento.split('/').map(Number)
        const hoy = new Date()
        const anioActual = hoy.getFullYear() % 100
        const mesActual = hoy.getMonth() + 1
        if (anio < anioActual || (anio === anioActual && mes < mesActual)) return 'La tarjeta está vencida'
        if (!/^\d{3}$/.test(cvv)) return 'El código de seguridad debe tener 3 dígitos'
        return ''
    }

    function handlePagar(){
        const errorTarjeta = validarTarjeta()
        if(errorTarjeta){
            setError(errorTarjeta)
            return
        }
        confirmarCompra()
    }

    // Al elegir una tarjeta guardada se completan los campos con sus datos.
    // Al elegir "otra" se vacian para que el usuario escriba la suya
    function elegirTarjeta(id) {
        setElegida(id)
        setError('')
        const tarjeta = TARJETAS.find((t) => t.id === id)

        setTitular(tarjeta ? tarjeta.titular : '')
        setNumero(tarjeta ? tarjeta.numero : '')
        setVencimiento(tarjeta ? tarjeta.vencimiento : '')
        setCvv(tarjeta ? tarjeta.cvv : '')
    }
      // Sin productos no hay nada que pagar: vuelve al carrito.
      // Mientras se esta comprando no: al terminar la compra el carrito queda
      // vacio y esto le ganaria al navigate que lleva al pedido
      // Si se entra directo a /pago (o se refresca), el carrito todavia no llego:
      // hay que esperarlo, si no parece vacio y manda de vuelta al carrito
      if (!cargado) return <p className="mensaje-vacio">Cargando...</p>
      if (items.length === 0 && !ocupado) return <Navigate to="/carrito" replace />

      return (
        <>
        <h1 className='titulo-seccion'>Pago</h1>
        <form className="form-caja" onSubmit={(e) => { e.preventDefault(); handlePagar() }}>
              <div className="pago-total">
                  <span>Total a pagar</span>
                  <strong>{precio(total)}</strong>
              </div>
              {error && <p className="mensaje-error">{error}</p>}
              <div className="tarjetas">
                  {TARJETAS.map((tarjeta) => (
                      <label key={tarjeta.id}
                             className={'tarjeta-opcion' + (elegida === tarjeta.id ? ' elegida' : '')}>
                          <input type="radio"
                                 name="tarjeta"
                                 checked={elegida === tarjeta.id}
                                 onChange={() => elegirTarjeta(tarjeta.id)} />
                          {tarjeta.nombre}
                      </label>
                  ))}
                  <label className={'tarjeta-opcion' + (elegida === 'otra' ? ' elegida' : '')}>
                      <input type="radio"
                             name="tarjeta"
                             checked={elegida === 'otra'}
                             onChange={() => elegirTarjeta('otra')} />
                      Usar otra tarjeta
                  </label>
              </div>
              <input value={titular}
                     placeholder="Nombre del titular (como figura en la tarjeta)"
                     onChange={(e) => setTitular(e.target.value)} />
              <input value={numero}
                     placeholder="Número de tarjeta"
                     inputMode="numeric"
                     maxLength={19}
                     onChange={(e) => setNumero(e.target.value)} />
              <input value={vencimiento}
                     placeholder="Vencimiento (MM/AA)"
                     maxLength={5}
                     onChange={(e) => setVencimiento(e.target.value)} />
              <input value={cvv}
                     type="password"
                     placeholder="CVV"
                     inputMode="numeric"
                     maxLength={3}
                     onChange={(e) => setCvv(e.target.value)} />
              <button type="submit" className="boton" disabled={ocupado}>
                  {ocupado ? 'Procesando pago...' : 'Pagar ' + precio(total)}
              </button>
          </form>
        </>
      )
}

export default Pago
