package com.cts.service;

import java.util.List;

import com.cts.entity.Hero;

public interface HeroService {
    Hero saveHero(Hero hero);
    List<Hero> getAllHeroes();
    void deleteAllHeroes();
}
