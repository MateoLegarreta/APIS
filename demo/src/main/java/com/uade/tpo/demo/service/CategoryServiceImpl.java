package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.exceptions.CategoryDuplicateException;
import com.uade.tpo.demo.exceptions.CategoryHasProductsException;
import com.uade.tpo.demo.repository.CategoryRepository;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.exceptions.CategoryNotFoundException;
@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;

    // Lista solo las categorias dadas de alta
    public Page<Category> getCategories(PageRequest pageable) {
        return categoryRepository.findByActiveTrue(pageable);
    }

    // Una categoria dada de baja no se puede consultar, igual que un producto
    public Optional<Category> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .filter(category -> Boolean.TRUE.equals(category.getActive()));
    }

    // Crea una categoria nueva, si no hay otra con la misma descripcion
    public Category createCategory(String description) throws CategoryDuplicateException {
        List<Category> categories = categoryRepository.findByDescription(description);
        if (categories.isEmpty())
            return categoryRepository.save(new Category(description));
        throw new CategoryDuplicateException();
    }

     // Cambia la descripcion de una categoria, y permite darla de baja o de alta.
     // No deja retirar una categoria que todavia tiene productos a la venta
     public Category updateCategory(Long categoryId, String description, Boolean active)
          throws CategoryNotFoundException, CategoryDuplicateException, CategoryHasProductsException {

      Optional<Category> result = categoryRepository.findById(categoryId);
      if (result.isEmpty())
          throw new CategoryNotFoundException();

      // Revisa que ninguna OTRA categoria tenga ya esa misma descripcion
      boolean duplicada = categoryRepository.findByDescription(description).stream()
              .anyMatch(category -> !category.getId().equals(categoryId));
      if (duplicada)
          throw new CategoryDuplicateException();

      Category category = result.get();
      // Se valida antes de tocar nada: solo importa si la baja ocurre ahora
      boolean estabaActiva = Boolean.TRUE.equals(category.getActive());
      if (estabaActiva && Boolean.FALSE.equals(active)
              && productRepository.existsByCategoryIdAndActiveTrue(categoryId))
          throw new CategoryHasProductsException();

      category.setDescription(description);
      // Permite dar de baja o volver a dar de alta la categoria
      if (active != null)
          category.setActive(active);
      return categoryRepository.save(category);
  }

}
