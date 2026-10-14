const CardProduct = ({ nombre, precio }) => {
    return (
        <div>
            <h2>{nombre}</h2>
            <p>Precio: ${precio}</p>
        </div>
    )
}

export default CardProduct
