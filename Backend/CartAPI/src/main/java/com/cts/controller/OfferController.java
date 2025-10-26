package com.cts.controller;

import com.cts.entity.Offer;
import com.cts.dto.BillDTO;
import com.cts.service.OfferService;
import com.cts.repository.OfferRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/offers")
public class OfferController {
    private final OfferRepository offerRepository;
    private final OfferService offerService;
    public OfferController(OfferRepository offerRepository, OfferService offerService) {
        this.offerRepository = offerRepository;
        this.offerService = offerService;
    }
    @GetMapping
    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }
    // Apply offer to an existing bill (PUT)
    // Example: PUT http://localhost:8080/api/offers/apply/1?code=OFF10
    @PutMapping("/apply/{billId}")
    public BillDTO applyOffer(@PathVariable Integer billId, @RequestParam String code) {
        return offerService.applyOffer(billId, code);
    }
    // Remove offer from an existing bill
    // Example: PUT http://localhost:8080/api/offers/remove/1
    @PutMapping("/remove/{billId}")
    public BillDTO removeOffer(@PathVariable Integer billId) {
        return offerService.removeOffer(billId);
    }
}