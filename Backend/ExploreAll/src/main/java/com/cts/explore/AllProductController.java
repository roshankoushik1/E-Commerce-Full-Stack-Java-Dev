package com.cts.explore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allproducts")
public class AllProductController {

    @Autowired
    private AllProductService allProductService;

    @GetMapping
    public List<AllProduct> getAllProducts() {
        return allProductService.getAllProducts();
    }

    @PostMapping
    public AllProduct createProduct(@RequestBody AllProduct product) {
        return allProductService.saveProduct(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return allProductService.getProductById(id)
                .map(product -> {
                    allProductService.deleteProduct(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(()->ResponseEntity.notFound().build());
    }
}