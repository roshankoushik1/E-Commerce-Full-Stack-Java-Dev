
package com.cts.explore;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AllProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;
    private Double originalPrice;
    private String image;
    private String category;
    private String brand;

    @ElementCollection
    private List<String> sizes;

    private Boolean isNew;
    private Boolean inStock;
    private Double rating;
}
