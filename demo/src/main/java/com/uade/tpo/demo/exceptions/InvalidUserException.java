package com.uade.tpo.demo.exceptions;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando los datos del usuario no son validos
@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Los datos del usuario son inválidos")
public class InvalidUserException extends Exception {
    
}
