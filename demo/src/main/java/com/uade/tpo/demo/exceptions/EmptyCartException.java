package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando se intenta confirmar la compra con el carrito vacio
@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "El carrito esta vacio, no se puede realizar el checkout")
public class EmptyCartException extends Exception {

}
