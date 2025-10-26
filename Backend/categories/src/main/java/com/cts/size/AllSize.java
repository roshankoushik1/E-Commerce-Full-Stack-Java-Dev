package com.cts.size;

import jakarta.persistence.*;

@Entity
@Table(name = "sizes")
public class AllSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String size;

    public AllSize() {}
    public AllSize(String size) { this.size = size; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
}

