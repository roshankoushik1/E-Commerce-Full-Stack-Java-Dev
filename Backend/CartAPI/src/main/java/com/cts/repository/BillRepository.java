// BillRepository.java
package com.cts.repository;
 
import com.cts.entity.Bill;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
 
    // Find all bills for a user
    List<Bill> findByUserId(Integer userId);
 
    // (Optional) Find the latest bill for a user
    Bill findTopByUserIdOrderByIdDesc(Integer userId);
}