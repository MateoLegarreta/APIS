package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.exceptions.CartItemNotFoundException;
import com.uade.tpo.demo.exceptions.CartNotFoundException;
import com.uade.tpo.demo.exceptions.EmptyCartException;
import com.uade.tpo.demo.exceptions.InsufficientStockException;
import com.uade.tpo.demo.exceptions.InvalidQuantityException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;

// Todas las operaciones que se pueden hacer con el carrito de compras
public interface CartService {

    public Cart getCartByUser(Long userId);

    public Cart addProductToCart(Long userId, Long productId, Integer quantity)
            throws ProductNotFoundException, InvalidQuantityException, InsufficientStockException;

    public Cart updateCartItem(Long userId, Long productId, Integer quantity)
            throws CartNotFoundException, CartItemNotFoundException, InvalidQuantityException,
            InsufficientStockException;

    public Cart removeProductFromCart(Long userId, Long productId)
            throws CartNotFoundException, CartItemNotFoundException;

    public void clearCart(Long userId) throws CartNotFoundException;

    public Order checkout(Long userId) throws CartNotFoundException, EmptyCartException, InsufficientStockException;
}
