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
import com.uade.tpo.demo.repository.CartItemRepository;
import com.uade.tpo.demo.repository.CategoryRepository;
import com.uade.tpo.demo.repository.ProductRepository;

import org.springframework.transaction.annotation.Transactional;

// Maneja los productos: crearlos, editarlos, borrarlos y buscarlos
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    // Busca productos con los filtros que se pasen (todos son opcionales)
    public Page<Product> getProducts(PageRequest pageRequest, Long categoryId,
        String name, Double priceMin, Double priceMax) {
    return productRepository.search(categoryId, name, priceMin, priceMax, pageRequest);
    }

     public Product getProductById(Long productId) throws ProductNotFoundException {
      return productRepository.findById(productId)
              .filter(p -> Boolean.TRUE.equals(p.getActive()))
              .orElseThrow(ProductNotFoundException::new);
  }

    // Crea un producto nuevo dentro de la categoria indicada
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

        return productRepository.save(product);
    }

    // Edita un producto existente. Si en esta edicion pasa de activo a inactivo,
    // tambien lo saca de los carritos para que nadie compre algo dado de baja
    @Transactional
    public Product updateProduct(Long productId, ProductRequest productRequest)
            throws ProductNotFoundException, CategoryNotFoundException, InvalidProductException {

        Optional<Product> result = productRepository.findById(productId);
        if (result.isEmpty())
            throw new ProductNotFoundException();
        validateProduct(productRequest);
        Category category = findCategory(productRequest.getCategoryId());

        Product product = result.get();
        // Se guarda el estado previo para saber si esta edicion lo da de baja
        boolean estabaActivo = Boolean.TRUE.equals(product.getActive());

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        if (productRequest.getDiscountPercentage() != null)
            product.setDiscountPercentage(productRequest.getDiscountPercentage());
        product.setStock(productRequest.getStock());
        product.setCategory(category);
        // Permite dar de baja o volver a dar de alta el producto
        if (productRequest.getActive() != null)
            product.setActive(productRequest.getActive());

        // Solo limpia los carritos cuando la baja ocurre en esta edicion
        if (estabaActivo && Boolean.FALSE.equals(product.getActive()))
            cartItemRepository.deleteByProductId(productId);

        return productRepository.save(product);
    }

    // Revisa que los datos del producto tengan sentido antes de guardarlo
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

    // Busca la categoria del producto, y avisa si no existe o esta dada de baja.
    // No se pueden cargar productos en una categoria retirada
    private Category findCategory(Long categoryId) throws CategoryNotFoundException {
        if (categoryId == null)
            throw new CategoryNotFoundException();

        Optional<Category> category = categoryRepository.findById(categoryId)
                .filter(c -> Boolean.TRUE.equals(c.getActive()));
        if (category.isEmpty())
            throw new CategoryNotFoundException();

        return category.get();
    }
}
