package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando la cantidad pedida es invalida, por ejemplo cero o negativa
@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "La cantidad indicada es invalida")
public class InvalidQuantityException extends Exception {

}
