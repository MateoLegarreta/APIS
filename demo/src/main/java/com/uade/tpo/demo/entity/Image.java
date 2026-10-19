package com.uade.tpo.demo.entity;

import java.sql.Blob;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Una foto guardada dentro de la base de datos. Blob quiere decir que la
// columna no guarda texto ni numeros sino el archivo en bytes.
// Va en su propia tabla y no como columna de Product para que el catalogo
// no tenga que traer todas las fotos en cada consulta de productos
@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "image_table")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lob avisa que la columna guarda un archivo grande. LONGBLOB va puesto
    // a mano porque el blob comun de MySQL aguanta solo 64 KB y una foto
    // de un producto se pasa facil
    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private Blob image;
}
