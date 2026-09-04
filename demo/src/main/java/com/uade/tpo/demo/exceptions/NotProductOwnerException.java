package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando alguien intenta editar o borrar un producto que no es suyo
@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "No sos el dueño de este producto")
public class NotProductOwnerException extends Exception {
}
