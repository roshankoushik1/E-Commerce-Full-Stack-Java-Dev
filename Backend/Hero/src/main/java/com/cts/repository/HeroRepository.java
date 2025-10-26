package com.cts.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cts.entity.Hero;

public interface HeroRepository extends JpaRepository<Hero, Long> {
}