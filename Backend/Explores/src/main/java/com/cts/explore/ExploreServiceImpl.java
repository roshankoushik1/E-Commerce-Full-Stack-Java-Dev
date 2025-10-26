package com.cts.explore;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ExploreServiceImpl implements ExploreService {

    private final ExploreRepository repo;

    public ExploreServiceImpl(ExploreRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Explore> findAll() {
        return repo.findAll();
    }

    @Override
    public java.util.Optional<Explore> findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<Explore> findNewArrivals() {
        return repo.findByIsNewTrue();
    }

    @Override
    public List<Explore> findByCategory(String category) {
        return repo.findByCategoryIgnoreCase(category);
    }

    @Override
    public List<Explore> findByBrand(String brand) {
        return repo.findByBrandIgnoreCase(brand);
    }

    @Override
    public List<Explore> findInStock() {
        return repo.findByInStockTrue();
    }

    @Override
    public Explore create(Explore e) {
        e.setId(null);
        return repo.save(e);
    }

    @Override
    public Explore update(Long id, Explore e) {
        Explore existing = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Explore not found: " + id));
        existing.setName(e.getName());
        existing.setPrice(e.getPrice());
        existing.setOriginalPrice(e.getOriginalPrice());
        existing.setImage(e.getImage());
        existing.setCategory(e.getCategory());
        existing.setBrand(e.getBrand());
        existing.setSizes(e.getSizes());
        existing.setColors(e.getColors());
        existing.setNew(e.isNew());
        existing.setInStock(e.isInStock());
        existing.setRating(e.getRating());
        existing.setReviews(e.getReviews());
        existing.setDescription(e.getDescription());
        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}