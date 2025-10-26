package com.cts.service;

import java.util.List;
import java.util.Optional;

import com.cts.entity.Product;

public interface ProductService {
    List<Product> findAll();
    Optional<Product> findById(Long id);
    List<Product> findNewArrivals();
    List<Product> findByCategory(String category);
    List<Product> findByBrand(String brand);
    List<Product> findInStock();
    Product create(Product p);
    Product update(Long id, Product p);
    void delete(Long id);
}
