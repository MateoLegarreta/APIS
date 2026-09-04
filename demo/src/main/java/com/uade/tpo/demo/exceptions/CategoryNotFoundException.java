package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando se busca una categoria que no existe
@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "La categoria indicada no existe")
public class CategoryNotFoundException extends Exception {

}
