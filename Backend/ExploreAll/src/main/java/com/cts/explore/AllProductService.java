package com.cts.explore;

import java.util.List;
import java.util.Optional;

public interface AllProductService {

    List<AllProduct> getAllProducts();

    AllProduct saveProduct(AllProduct product);

    Optional<AllProduct> getProductById(Long id);

    void deleteProduct(Long id);
}