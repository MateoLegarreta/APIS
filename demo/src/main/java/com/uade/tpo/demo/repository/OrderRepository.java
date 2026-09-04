package com.uade.tpo.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Busca las ordenes de un usuario, ordenadas de la mas reciente a la mas antigua
    List<Order> findByUserIdOrderByDateDesc(Long userId);
}
