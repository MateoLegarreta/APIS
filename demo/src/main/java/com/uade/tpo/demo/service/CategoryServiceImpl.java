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

    public Page<Category> getCategories(PageRequest pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Optional<Category> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }

    public Category createCategory(String description) throws CategoryDuplicateException {
        List<Category> categories = categoryRepository.findByDescription(description);
        if (categories.isEmpty())
            return categoryRepository.save(new Category(description));
        throw new CategoryDuplicateException();
    }

     public Category updateCategory(Long categoryId, String description)
          throws CategoryNotFoundException, CategoryDuplicateException {

      Optional<Category> result = categoryRepository.findById(categoryId);
      if (result.isEmpty())
          throw new CategoryNotFoundException();

      boolean duplicada = categoryRepository.findByDescription(description).stream()
              .anyMatch(category -> !category.getId().equals(categoryId));
      if (duplicada)
          throw new CategoryDuplicateException();

      Category category = result.get();
      category.setDescription(description);
      return categoryRepository.save(category);
  }

    public void deleteCategory(Long categoryId)
            throws CategoryNotFoundException, CategoryHasProductsException {

        if (!categoryRepository.existsById(categoryId))
            throw new CategoryNotFoundException();

        if (productRepository.existsByCategoryId(categoryId))
            throw new CategoryHasProductsException();

        categoryRepository.deleteById(categoryId);
    }

}
