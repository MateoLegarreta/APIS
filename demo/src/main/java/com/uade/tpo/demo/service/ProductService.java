package com.uade.tpo.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.dto.ProductRequest;
import com.uade.tpo.demo.exceptions.CategoryNotFoundException;
import com.uade.tpo.demo.exceptions.InvalidProductException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;


// Todas las operaciones que se pueden hacer con los productos
public interface ProductService {

    public Page<Product> getProducts(PageRequest pageRequest, Long categoryId,
            String name, Double priceMin, Double priceMax);

    public Product getProductById(Long productId) throws ProductNotFoundException;

    public Product createProduct(ProductRequest productRequest)
            throws CategoryNotFoundException, InvalidProductException;

    public Product updateProduct(Long productId, ProductRequest productRequest)
            throws ProductNotFoundException, CategoryNotFoundException, InvalidProductException;

    public void deleteProduct(Long productId) throws ProductNotFoundException;
}
