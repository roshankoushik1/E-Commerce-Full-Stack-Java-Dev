package com.cts.service;
 
import com.cts.dto.BillDTO;
import com.cts.dto.CartItemDTO;
import com.cts.dto.OfferDTO;
import com.cts.entity.Bill;
import com.cts.entity.CartItem;
import com.cts.entity.Offer;
import com.cts.repository.BillRepository;
import com.cts.repository.OfferRepository;
import org.springframework.stereotype.Service;
 
import java.util.List;
import java.util.stream.Collectors;
 
@Service
public class OfferService {
 
    private final OfferRepository offerRepository;
    private final BillRepository billRepository;
 
    public OfferService(OfferRepository offerRepository, BillRepository billRepository) {
        this.offerRepository = offerRepository;
        this.billRepository = billRepository;
    }
 
    public BillDTO applyOffer(Integer billId, String code) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));
 
        Offer offer = offerRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Offer not found: " + code));
 
        if (bill.getSubTotal() < offer.getMinOrderPrice()) {
            throw new RuntimeException("Subtotal not eligible for this offer");
        }
 
        int discount = (bill.getSubTotal() * offer.getOffPercentage()) / 100;
        bill.setDiscountAmount(discount);
        bill.setAppliedOffer(offer);
        bill.setTotalAmount(bill.getSubTotal() - discount);
 
        Bill saved = billRepository.save(bill);
        return convertToDTO(saved);
    }
 
    public BillDTO removeOffer(Integer billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
 
        bill.setAppliedOffer(null);
        bill.setDiscountAmount(0);
        bill.setTotalAmount(bill.getSubTotal());
 
        Bill updatedBill = billRepository.save(bill);
        return convertToDTO(updatedBill);
    }
 
    private BillDTO convertToDTO(Bill bill) {
        BillDTO dto = new BillDTO();
        dto.setId(bill.getId());
        dto.setSubTotal(bill.getSubTotal());
        dto.setDiscountAmount(bill.getDiscountAmount());
        dto.setTotalAmount(bill.getTotalAmount());
 
        if (bill.getAppliedOffer() != null) {
            Offer offer = bill.getAppliedOffer();
            OfferDTO offerDTO = new OfferDTO();
            offerDTO.setId(offer.getId());
            offerDTO.setCode(offer.getCode());
            offerDTO.setOffPercentage(offer.getOffPercentage());
            offerDTO.setMinOrderPrice(offer.getMinOrderPrice());
            dto.setAppliedOffer(offerDTO);
        }
 
        List<CartItemDTO> itemDTOs = bill.getItems().stream().map(item -> {
            CartItemDTO itemDTO = new CartItemDTO();
            itemDTO.setProductId(item.getProductId());
            itemDTO.setName(item.getName());
            itemDTO.setDiscountedPrice(item.getDiscountedPrice());
            itemDTO.setQuantity(item.getQuantity());
            return itemDTO;
        }).collect(Collectors.toList());
 
        dto.setItems(itemDTOs);
        return dto;
    }
}