package com.cts.size;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AllSizeServiceImpl implements AllSizeService {

    private final AllSizeRepository sizeRepository;

    public AllSizeServiceImpl(AllSizeRepository sizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    @Override
    public AllSize saveSize(AllSize size) {
        return sizeRepository.save(size);
    }

    @Override
    public List<AllSize> getAllSizes() {
        return sizeRepository.findAll();
    }
}