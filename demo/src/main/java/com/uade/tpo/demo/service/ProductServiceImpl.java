package com.uade.tpo.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.dto.ProductRequest;
import com.uade.tpo.demo.exceptions.CategoryNotFoundException;
import com.uade.tpo.demo.exceptions.InvalidProductException;
import com.uade.tpo.demo.exceptions.NotProductOwnerException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.repository.CategoryRepository;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.entity.Role;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<Product> getProducts(PageRequest pageRequest, Long categoryId,
        String name, Double priceMin, Double priceMax) {
    return productRepository.search(categoryId, name, priceMin, priceMax, pageRequest);
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
        if (productRequest.getDiscountPercentage() != null)
            product.setDiscountPercentage(productRequest.getDiscountPercentage());
        product.setStock(productRequest.getStock());
        product.setCategory(category);
        product.setSeller(getLoggedUser());

        return productRepository.save(product);
    }

    public Product updateProduct(Long productId, ProductRequest productRequest)
            throws ProductNotFoundException, CategoryNotFoundException, InvalidProductException, NotProductOwnerException {

        Optional<Product> result = productRepository.findById(productId);
        if (result.isEmpty())
            throw new ProductNotFoundException();
        validateOwner(result.get());
        validateProduct(productRequest);
        Category category = findCategory(productRequest.getCategoryId());

        Product product = result.get();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        if (productRequest.getDiscountPercentage() != null)
            product.setDiscountPercentage(productRequest.getDiscountPercentage());
        product.setStock(productRequest.getStock());
        product.setCategory(category);

        return productRepository.save(product);
    }

    public void deleteProduct(Long productId)
        throws ProductNotFoundException, NotProductOwnerException {

    Optional<Product> result = productRepository.findById(productId);
    if (result.isEmpty())
        throw new ProductNotFoundException();

    validateOwner(result.get());

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

        if (productRequest.getDiscountPercentage() != null
                && (productRequest.getDiscountPercentage() < 0
                        || productRequest.getDiscountPercentage() > 100))
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

    private User getLoggedUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    } 

    private void validateOwner(Product product) throws NotProductOwnerException {
        User loggedUser = getLoggedUser();

        if (loggedUser.getRole() == Role.ADMIN)
            return;
        if (!product.getSeller().getId().equals(loggedUser.getId()))
            throw new NotProductOwnerException();
    }
}
