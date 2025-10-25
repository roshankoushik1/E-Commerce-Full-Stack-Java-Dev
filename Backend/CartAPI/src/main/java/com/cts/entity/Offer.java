package com.cts.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "offer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    // offer code (e.g. "OFF10")
    @Column(nullable = false, unique = true)
    private String code;
    // percentage off (e.g. 10 means 10%)
    @Column(nullable = false)
    private Integer offPercentage;
    // minimum order subtotal required to apply this offer
    @Column(nullable = false)
    private Integer minOrderPrice;
}