package com.uade.tpo.demo.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.entity.Cart;
import com.uade.tpo.demo.entity.CartItem;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.OrderItem;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.CartItemNotFoundException;
import com.uade.tpo.demo.exceptions.CartNotFoundException;
import com.uade.tpo.demo.exceptions.EmptyCartException;
import com.uade.tpo.demo.exceptions.InsufficientStockException;
import com.uade.tpo.demo.exceptions.InvalidQuantityException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.repository.CartRepository;
import com.uade.tpo.demo.repository.OrderRepository;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.repository.UserRepository;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Cart getCartByUser(Long userId) {
        return getOrCreateCart(userId);
    }

    @Override
    public Cart addProductToCart(Long userId, Long productId, Integer quantity)
            throws ProductNotFoundException, InvalidQuantityException, InsufficientStockException {

        if (quantity == null || quantity <= 0)
            throw new InvalidQuantityException();

        Product product = productRepository.findById(productId)
                .orElseThrow(ProductNotFoundException::new);

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        // Si el producto ya está en el carrito, se suma a la cantidad existente
        int newQuantity = quantity;
        if (existing.isPresent())
            newQuantity += existing.get().getQuantity();

        if (newQuantity > product.getStock())
            throw new InsufficientStockException();

        if (existing.isPresent()) {
            existing.get().setQuantity(newQuantity);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(newQuantity);
            cart.getItems().add(item);
        }

        return cartRepository.save(cart);
    }

    @Override
    public Cart updateCartItem(Long userId, Long productId, Integer quantity)
            throws CartNotFoundException, CartItemNotFoundException, InvalidQuantityException,
            InsufficientStockException {

        if (quantity == null || quantity <= 0)
            throw new InvalidQuantityException();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(CartNotFoundException::new);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(CartItemNotFoundException::new);

        if (quantity > item.getProduct().getStock())
            throw new InsufficientStockException();

        // Acá se fija la cantidad exacta (no se suma a lo que ya había)
        item.setQuantity(quantity);

        return cartRepository.save(cart);
    }

    @Override
    public Cart removeProductFromCart(Long userId, Long productId)
            throws CartNotFoundException, CartItemNotFoundException {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(CartNotFoundException::new);

        boolean removed = cart.getItems().removeIf(i -> i.getProduct().getId().equals(productId));
        if (!removed)
            throw new CartItemNotFoundException();

        return cartRepository.save(cart);
    }

    @Override
    public void clearCart(Long userId) throws CartNotFoundException {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(CartNotFoundException::new);

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public Order checkout(Long userId)
            throws CartNotFoundException, EmptyCartException, InsufficientStockException {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(CartNotFoundException::new);

        if (cart.getItems().isEmpty())
            throw new EmptyCartException();

        // 1) Validar stock de TODOS los productos antes de descontar nada
        for (CartItem item : cart.getItems()) {
            if (item.getQuantity() > item.getProduct().getStock())
                throw new InsufficientStockException();
        }

        User user = userRepository.findById(userId).orElseThrow();

        Order order = new Order();
        order.setUser(user);
        order.setDate(LocalDateTime.now());

        // 2) Descontar stock, armar las líneas del pedido y calcular el total
        double total = 0.0;
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            order.getItems().add(orderItem);

            total += product.getPrice() * item.getQuantity();
        }
        order.setTotal(total);

        Order savedOrder = orderRepository.save(order);

        // 3) Vaciar el carrito luego de confirmar la compra
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            User user = userRepository.findById(userId).orElseThrow();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }
}
