package com.cts.explore;

import java.util.List;
import java.util.Optional;

public interface ExploreService {
    List<Explore> findAll();
    Optional<Explore> findById(Long id);
    List<Explore> findNewArrivals();
    List<Explore> findByCategory(String category);
    List<Explore> findByBrand(String brand);
    List<Explore> findInStock();
    Explore create(Explore e);
    Explore update(Long id, Explore e);
    void delete(Long id);
}
