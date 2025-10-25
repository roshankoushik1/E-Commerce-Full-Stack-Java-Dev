package com.cts.explore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AllProductServiceImpl implements AllProductService {

    @Autowired
    private AllProductRepository allProductRepository;

    @Override
    public List<AllProduct> getAllProducts() {
        return allProductRepository.findAll();
    }

    @Override
    public AllProduct saveProduct(AllProduct product) {
        return allProductRepository.save(product);
    }

    @Override
    public Optional<AllProduct> getProductById(Long id) {
        return allProductRepository.findById(id);
    }

    @Override
    public void deleteProduct(Long id) {
        allProductRepository.deleteById(id);
    }
}