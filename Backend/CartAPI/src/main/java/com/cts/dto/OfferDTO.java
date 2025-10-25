package com.cts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferDTO {
    private Integer id;
    private String code;
    private Integer offPercentage;
    private Integer minOrderPrice;
}