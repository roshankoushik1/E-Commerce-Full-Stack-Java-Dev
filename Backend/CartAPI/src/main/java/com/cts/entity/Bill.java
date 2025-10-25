package com.cts.entity;
 
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
 
import java.util.ArrayList;
import java.util.List;
 
@Entity
@Table(name = "Bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bill {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
 
    private Integer subTotal = 0;
    private Integer discountAmount = 0;
    private Integer totalAmount = 0;
 
    @Column(name = "user_id", nullable = false)
    private Integer userId;
 
    // No orphanRemoval to avoid unintended deletes of CartItem
    @OneToMany(mappedBy = "bill")
    @JsonManagedReference
    private List<CartItem> items = new ArrayList<>();
 
    @ManyToOne
    @JoinColumn(name = "applied_offer_id")
    private Offer appliedOffer;
 
    public List<CartItem> getItems() {
        if (items == null) items = new ArrayList<>();
        return items;
    }
 
    public void setItems(List<CartItem> items) {
        this.items = (items == null) ? new ArrayList<>() : new ArrayList<>(items);
    }
}