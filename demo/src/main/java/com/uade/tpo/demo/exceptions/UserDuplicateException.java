package com.uade.tpo.demo.exceptions;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando ya existe un usuario con ese mismo email
@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "El usuario que se intenta agregar esta duplicado")
public class UserDuplicateException extends Exception {
    
}
