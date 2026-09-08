package com.uade.tpo.demo.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Respuesta de las operaciones que no devuelven un recurso, para que el front
// siempre tenga algo que mostrar en vez de un cuerpo vacio
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {
    private String message;
}
