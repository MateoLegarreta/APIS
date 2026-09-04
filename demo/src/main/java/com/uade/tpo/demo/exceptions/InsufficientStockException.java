package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando se pide mas cantidad de la que hay disponible
@ResponseStatus(code = HttpStatus.CONFLICT, reason = "No hay stock suficiente para la cantidad solicitada")
public class InsufficientStockException extends Exception {

}
