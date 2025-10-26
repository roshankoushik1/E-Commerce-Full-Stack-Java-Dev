package com.cts.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cts.entity.Hero;
import com.cts.repository.HeroRepository;

import java.util.List;

@Service
public class HeroServiceImpl implements HeroService {

    @Autowired
    private HeroRepository heroRepository;

    @Override
    public Hero saveHero(Hero hero) {
        return heroRepository.save(hero);
    }

    @Override
    public List<Hero> getAllHeroes() {
        return heroRepository.findAll();
    }

    @Override
    public void deleteAllHeroes() {
        heroRepository.deleteAll();
    }
}