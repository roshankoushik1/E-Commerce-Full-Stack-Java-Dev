package com.cts.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cts.entity.Hero;
import com.cts.service.HeroService;

import java.util.List;

@RestController
@RequestMapping("/api/hero")
public class HeroController {

    @Autowired
    private HeroService heroService;

    @PostMapping
    public Hero saveHero(@RequestBody Hero hero) {
        return heroService.saveHero(hero);
    }

    @GetMapping
    public List<Hero> getAllHeroes() {
        return heroService.getAllHeroes();
    }

    @DeleteMapping
    public ResponseEntity<String> deleteAllHeroes() {
        heroService.deleteAllHeroes();
        return ResponseEntity.ok("All hero images have been deleted.");
    }
}