package com.uade.tpo.demo.exceptions;

  import org.springframework.http.HttpStatus;
  import org.springframework.web.bind.annotation.ResponseStatus;

  // Se lanza cuando se intenta borrar una categoria que todavia tiene productos
  @ResponseStatus(code = HttpStatus.CONFLICT, reason = "La categoria tiene productos asociados")
  public class CategoryHasProductsException extends Exception {

  }