package com.uade.tpo.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.dto.ProductRequest;
import com.uade.tpo.demo.exceptions.CategoryNotFoundException;
import com.uade.tpo.demo.exceptions.InvalidProductException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.repository.CategoryRepository;
import com.uade.tpo.demo.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<Product> getProducts(PageRequest pageRequest) {
        return productRepository.findAll(pageRequest);
    }

    public Optional<Product> getProductById(Long productId) {
        return productRepository.findById(productId);
    }

    public Product createProduct(ProductRequest productRequest)
            throws CategoryNotFoundException, InvalidProductException {

        validateProduct(productRequest);
        Category category = findCategory(productRequest.getCategoryId());

        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setStock(productRequest.getStock());
        product.setCategory(category);

        return productRepository.save(product);
    }

    public Product updateProduct(Long productId, ProductRequest productRequest)
            throws ProductNotFoundException, CategoryNotFoundException, InvalidProductException {

        Optional<Product> result = productRepository.findById(productId);
        if (result.isEmpty())
            throw new ProductNotFoundException();

        validateProduct(productRequest);
        Category category = findCategory(productRequest.getCategoryId());

        Product product = result.get();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setStock(productRequest.getStock());
        product.setCategory(category);

        return productRepository.save(product);
    }

    public void deleteProduct(Long productId) throws ProductNotFoundException {
        if (!productRepository.existsById(productId))
            throw new ProductNotFoundException();

        productRepository.deleteById(productId);
    }

    private void validateProduct(ProductRequest productRequest) throws InvalidProductException {
        if (productRequest.getName() == null || productRequest.getName().isBlank())
            throw new InvalidProductException();

        if (productRequest.getDescription() == null || productRequest.getDescription().isBlank())
            throw new InvalidProductException();

        if (productRequest.getPrice() == null || productRequest.getPrice() <= 0)
            throw new InvalidProductException();

        if (productRequest.getStock() == null || productRequest.getStock() < 0)
            throw new InvalidProductException();
    }

    private Category findCategory(Long categoryId) throws CategoryNotFoundException {
        if (categoryId == null)
            throw new CategoryNotFoundException();

        Optional<Category> category = categoryRepository.findById(categoryId);
        if (category.isEmpty())
            throw new CategoryNotFoundException();

        return category.get();
    }
}
