package com.cts.explore;


import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/Explores")

public class ExploreController {

    private final ExploreService service;

    public ExploreController(ExploreService service) {
        this.service = service;
    }

    @GetMapping
    public List<Explore> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Boolean isNew
    ) {
        if (category != null) return service.findByCategory(category);
        if (brand != null) return service.findByBrand(brand);
        if (Boolean.TRUE.equals(inStock)) return service.findInStock();
        if (Boolean.TRUE.equals(isNew)) return service.findNewArrivals();
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Explore> getOne(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Explore> create(@Valid @RequestBody Explore e) {
        Explore created = service.create(e);
        return ResponseEntity.created(URI.create("/api/Explores/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Explore> update(@PathVariable Long id, @Valid @RequestBody Explore e) {
        Explore updated = service.update(id, e);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}