package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando se busca un producto que no esta en el carrito
@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "El producto indicado no se encuentra en el carrito")
public class CartItemNotFoundException extends Exception {

}
