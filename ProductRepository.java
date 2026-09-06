package com.uade.tpo.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
  // Dice si una categoria tiene al menos un producto activo
  boolean existsByCategoryIdAndActiveTrue(Long categoryId);

        // Busca productos filtrando por categoria, nombre y rango de precio, todos opcionales.
    // Solo devuelve los que estan dados de alta
    @Query("""
            select p from Product p
            where p.active = true
              and (:categoryId is null or p.category.id = :categoryId)
              and (:name is null or lower(p.name) like lower(concat('%', :name, '%')))
              and (:priceMin is null or p.price * (1 - p.discountPercentage / 100) >= :priceMin)
              and (:priceMax is null or p.price * (1 - p.discountPercentage / 100) <= :priceMax)
            """)
    Page<Product> search(
            @Param("categoryId") Long categoryId,
            @Param("name") String name,
            @Param("priceMin") Double priceMin,
            @Param("priceMax") Double priceMax,
            Pageable pageable);
}
