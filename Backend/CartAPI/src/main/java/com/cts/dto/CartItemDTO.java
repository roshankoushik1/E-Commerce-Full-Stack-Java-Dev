// CartItemDTO.java
package com.cts.dto;
 
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Integer productId;
    private Integer quantity;
    private String name;
    private Integer discountedPrice;
    private Integer userId; // Used to associate with user (set in backend)
}