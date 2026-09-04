package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando se busca un producto que no existe
@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "El producto indicado no existe")
public class ProductNotFoundException extends Exception {

}
