// CartItem.java
package com.cts.entity;
 
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
 
@Entity
@Table(name = "CartItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
 
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
 
	private Integer productId;
	private String name;
	private Integer discountedPrice;
	private Integer originalPrice;
	private String image;
	private String category;
	private String brand;
	private String size;
	private String color;
	private Boolean instock;
	private Integer quantity;
	private Integer discount;
 
	@Column(name = "user_id", nullable = false)
	private Integer userId;
 
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bill_id")
	@JsonIgnore
	private Bill bill;
 
	@PrePersist
	@PreUpdate
	public void normalize() {
	    if (size == null || size.isBlank()) size = "NA";
	    if (color == null || color.isBlank()) color = "NA";
	    if (quantity == null || quantity < 1) quantity = 1;
	}
}