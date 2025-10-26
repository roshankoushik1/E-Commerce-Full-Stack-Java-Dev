package com.cts.brand;

import java.util.List;

public interface BrandService {
    Brand saveBrand(Brand brand);
    List<Brand> getAllBrands();
}