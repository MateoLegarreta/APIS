package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando se pide envio a domicilio pero no hay direccion a donde mandarlo
@ResponseStatus(code = HttpStatus.UNPROCESSABLE_ENTITY, reason = "Para el envio a domicilio hace falta una direccion")
public class MissingAddressException extends Exception {

}
