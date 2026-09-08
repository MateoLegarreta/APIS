package com.uade.tpo.demo.entity.dto;

import lombok.Data;

@Data
public class CategoryRequest {
    private String description;
    // Opcional: sirve para volver a dar de alta una categoria dada de baja
    private Boolean active;
}
