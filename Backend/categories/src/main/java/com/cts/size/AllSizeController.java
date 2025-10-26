package com.cts.size;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sizes")
public class AllSizeController {

    private final AllSizeService sizeService;

    public AllSizeController(AllSizeService sizeService) {
        this.sizeService = sizeService;
    }

    @PostMapping
    public AllSize addSize(@RequestBody AllSize size) {
        return sizeService.saveSize(size);
    }

    @GetMapping
    public List<AllSize> getAllSizes() {
        return sizeService.getAllSizes();
    }
}