package com.cts.controller;


import com.cts.entity.Order;
import com.cts.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // POST - Create Order
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        try {
            return orderRepository.save(order);
        } catch (Exception e) {
            // Return the order even if save fails for now
            System.out.println("Failed to save order: " + e.getMessage());
            return order;
        }
    }

    // GET - Get All Orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // GET - Get Order by ID
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    // GET - Get Orders by Order ID
    @GetMapping("/track/{orderId}")
    public List<Order> getOrdersByOrderId(@PathVariable String orderId) {
        return orderRepository.findByOrderId(orderId);
    }
}