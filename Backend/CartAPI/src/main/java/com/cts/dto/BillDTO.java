// BillDTO.java
package com.cts.dto;
 
import lombok.Data;
import java.util.List;
 
@Data
public class BillDTO {
    private Integer id;
    private Integer subTotal;
    private Integer discountAmount;
    private Integer totalAmount;
    private Integer userId; // Used to associate with user (set in backend)
    private List<CartItemDTO> items;
    private OfferDTO appliedOffer;
}