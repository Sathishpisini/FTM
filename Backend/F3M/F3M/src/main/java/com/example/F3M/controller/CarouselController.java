package com.example.F3M.controller;

import com.example.F3M.model.Carousel;
import com.example.F3M.service.CarouselService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carousel")
@CrossOrigin(origins = "http://localhost:5173")
public class CarouselController {

    private final CarouselService service;

    public CarouselController(CarouselService service) {
        this.service = service;
    }

    @GetMapping
    public List<Carousel> getSlides() {
        return service.getAllSlides();
    }
}