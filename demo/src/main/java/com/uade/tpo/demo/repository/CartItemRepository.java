package com.uade.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.entity.CartItem;


@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

// Saca un producto de todos los carritos donde este cargado
void deleteByProductId(Long productId);


}
