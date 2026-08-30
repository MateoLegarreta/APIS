package com.uade.tpo.demo.exceptions;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Los datos del usuario son inválidos")
public class InvalidUserException extends Exception {
    
}
