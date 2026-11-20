package com.uade.tpo.demo.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

// Un pedido ya confirmado, se crea cuando el usuario hace checkout del carrito
@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // Total final: productos + costo de envio
    @Column(nullable = false)
    private Double total;

    // Las columnas de entrega aceptan null porque los pedidos viejos no las tienen
    @Enumerated(EnumType.STRING)
    @Column
    private DeliveryMethod deliveryMethod;

    // A donde se manda el pedido. Se copia al comprar, asi no cambia
    // si despues el usuario edita su direccion
    @Column
    private String shippingAddress;

    // Lo que se cobro de envio (0 si retira por el local)
    @Column
    private Double shippingCost;

    @Column(nullable = false)
    private LocalDateTime date;
}
