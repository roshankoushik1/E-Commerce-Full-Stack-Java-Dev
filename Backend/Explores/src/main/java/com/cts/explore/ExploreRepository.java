package com.cts.explore;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExploreRepository extends JpaRepository<Explore, Long> {
    List<Explore> findByIsNewTrue();
    List<Explore> findByCategoryIgnoreCase(String category);
    List<Explore> findByBrandIgnoreCase(String brand);
    List<Explore> findByInStockTrue();
}