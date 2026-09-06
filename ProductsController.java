package com.uade.tpo.demo.controllers;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.dto.ProductRequest;
import com.uade.tpo.demo.exceptions.CategoryNotFoundException;
import com.uade.tpo.demo.exceptions.InvalidProductException;
import com.uade.tpo.demo.exceptions.NotProductOwnerException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.service.ProductService;


// Rutas para ver y administrar los productos
@RestController
@RequestMapping("products")
public class ProductsController {

    @Autowired
    private ProductService productService;

    // Lista los productos, con filtros opcionales de categoria, nombre y precio
    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax) {

        if (page == null || size == null)
            return ResponseEntity.ok(productService.getProducts(
                    PageRequest.of(0, Integer.MAX_VALUE), categoryId, name, priceMin, priceMax));

        return ResponseEntity.ok(productService.getProducts(
                PageRequest.of(page, size), categoryId, name, priceMin, priceMax));
    }

    // Busca un producto por su id
    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable Long productId)
            throws ProductNotFoundException {
                return ResponseEntity.ok(productService.getProductById(productId));
    }

    // Solo un vendedor o el admin pueden crear productos nuevos
    @PreAuthorize("hasAnyAuthority('SELLER','ADMIN')")
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest productRequest)
            throws CategoryNotFoundException, InvalidProductException {
        Product result = productService.createProduct(productRequest);
        return ResponseEntity.created(URI.create("/products/" + result.getId())).body(result);
    }

    // Solo un vendedor o el admin pueden editar un producto
    @PreAuthorize("hasAnyAuthority('SELLER','ADMIN')")
    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductRequest productRequest)
            throws ProductNotFoundException, CategoryNotFoundException, InvalidProductException, NotProductOwnerException {
        return ResponseEntity.ok(productService.updateProduct(productId, productRequest));
    }

    // Solo un vendedor o el admin pueden borrar un producto
    @PreAuthorize("hasAnyAuthority('SELLER','ADMIN')")
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId)
            throws ProductNotFoundException, NotProductOwnerException {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}
