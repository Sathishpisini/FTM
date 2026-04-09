package com.example.F3M.service;

import com.example.F3M.model.Carousel;
import com.example.F3M.repo.CarouselRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarouselService {

    private final CarouselRepository repo;

    public CarouselService(CarouselRepository repo) {
        this.repo = repo;
    }

    public List<Carousel> getAllSlides() {
        return repo.findAll();
    }
}