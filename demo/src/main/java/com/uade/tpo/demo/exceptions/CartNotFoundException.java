package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando se busca un carrito que no existe
@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "El carrito indicado no existe")
public class CartNotFoundException extends Exception {

}
