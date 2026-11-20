package com.uade.tpo.demo.entity.dto;

import com.uade.tpo.demo.entity.DeliveryMethod;

import lombok.Data;

// Lo que elige el comprador al confirmar la compra
@Data
public class CheckoutRequest {
    // Si no viene, se toma como retiro por el local
    private DeliveryMethod deliveryMethod;
    // Opcional: si no viene, se usa la direccion guardada en el usuario
    private String address;
}
