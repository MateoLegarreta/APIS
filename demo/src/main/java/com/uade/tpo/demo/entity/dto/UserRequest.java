package com.uade.tpo.demo.entity.dto;
import lombok.Data;

@Data
public class UserRequest {
    private String email;
    private String name;
    private String surname;
    // Opcional: sirve para dar de baja o volver a dar de alta al usuario
    private Boolean active;
    
}
