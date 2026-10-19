package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando se pide una foto que no existe
@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "La imagen indicada no existe")
public class ImageNotFoundException extends Exception {

}
