package com.uade.tpo.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

// Categoria a la que puede pertenecer un producto
@Data
@Entity
public class Category {

    public Category() {
    }

    public Category(String description) {
        this.description = description;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String description;

    // Permite dar de baja la categoria sin borrar la fila, para no romper
    // los productos que la estan usando
    @Column(nullable = false)
    private Boolean active = true;

   
}
