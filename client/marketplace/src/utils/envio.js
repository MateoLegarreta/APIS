// Formas de entrega. Tienen que coincidir con el enum DeliveryMethod del back
export const RETIRO = 'PICKUP'
export const ENVIO = 'DELIVERY'

// Costo del envio a domicilio, solo para mostrarlo antes de pagar.
// El que se cobra de verdad lo define el back (application.shipping.cost):
// si se cambia alla, hay que cambiarlo aca tambien
export const COSTO_ENVIO = 1000
