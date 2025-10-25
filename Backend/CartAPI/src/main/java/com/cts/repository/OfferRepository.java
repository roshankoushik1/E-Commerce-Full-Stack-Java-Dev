package com.cts.repository;
import com.cts.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface OfferRepository extends JpaRepository<Offer, Integer> {
    Optional<Offer> findByCode(String code);
}