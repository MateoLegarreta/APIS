package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando alguien intenta ver una orden que no le pertenece
@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Esta orden no es tuya")
public class NotOrderOwnerException extends Exception {
}
