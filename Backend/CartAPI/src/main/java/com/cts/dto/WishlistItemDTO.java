// WishlistItemDTO.java
package com.cts.dto;
 
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemDTO {
    private Integer productId;
    private Integer userId; // Used to associate with user (set in backend)
}