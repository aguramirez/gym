package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.entity.RutinaEjercicio;
import com.example.backend.repositories.RutinaEjercicioRepository;

@Service
public class RutinaEjercicioService {
    @Autowired
    private RutinaEjercicioRepository rutinaEjercicioRepository;

    public List<RutinaEjercicio> findAll() {
        return rutinaEjercicioRepository.findAll();
    }

    public RutinaEjercicio findById(Long id) {
        return rutinaEjercicioRepository.findById(id).orElse(null);
    }

    public RutinaEjercicio save(RutinaEjercicio rutinaEjercicio) {
        return rutinaEjercicioRepository.save(rutinaEjercicio);
    }

    public void deleteById(Long id) {
        rutinaEjercicioRepository.deleteById(id);
    }
}
