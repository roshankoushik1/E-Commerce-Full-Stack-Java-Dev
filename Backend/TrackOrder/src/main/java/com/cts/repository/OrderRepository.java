package com.cts.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.cts.entity.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByOrderId(String orderId);
}