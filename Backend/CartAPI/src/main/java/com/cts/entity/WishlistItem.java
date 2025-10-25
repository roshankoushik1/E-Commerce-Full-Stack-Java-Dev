// WishlistItem.java
package com.cts.entity;
 
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
 
@Entity
@Table(name = "WishlistItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItem {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
 
    private Integer productId;
    private String name;
    private Integer originalPrice;
    private Integer discountedPrice;
    private String image;
    private Integer discount;
    private String category;
    private String brand;
    private String size;
    private String color;
    private Boolean instock;
    private Integer quantity;
 
    @Column(name = "user_id", nullable = false)
    private Integer userId;
}