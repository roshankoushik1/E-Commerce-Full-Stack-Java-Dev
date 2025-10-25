package com.cts.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.entity.Product;
import com.cts.repository.ProductRepository;

import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repo;

    public ProductServiceImpl(ProductRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Product> findAll() {
        return repo.findAll();
    }

    @Override
    public java.util.Optional<Product> findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<Product> findNewArrivals() {
        return repo.findByIsNewTrue();
    }

    @Override
    public List<Product> findByCategory(String category) {
        return repo.findByCategoryIgnoreCase(category);
    }

    @Override
    public List<Product> findByBrand(String brand) {
        return repo.findByBrandIgnoreCase(brand);
    }

    @Override
    public List<Product> findInStock() {
        return repo.findByInStockTrue();
    }

    @Override
    public Product create(Product p) {
        p.setId(null);
        return repo.save(p);
    }

    @Override
    public Product update(Long id, Product p) {
        Product existing = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
        existing.setName(p.getName());
        existing.setPrice(p.getPrice());
        existing.setOriginalPrice(p.getOriginalPrice());
        existing.setImage(p.getImage());
        existing.setCategory(p.getCategory());
        existing.setBrand(p.getBrand());
        existing.setSizes(p.getSizes());
        existing.setColors(p.getColors());
        existing.setNew(p.isNew());
        existing.setInStock(p.isInStock());
        existing.setRating(p.getRating());
        existing.setReviews(p.getReviews());
        existing.setDescription(p.getDescription());
        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}