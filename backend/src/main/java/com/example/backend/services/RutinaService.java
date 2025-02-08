package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.entity.Rutina;
import com.example.backend.repositories.RutinaRepository;

@Service
public class RutinaService {
    @Autowired
    private RutinaRepository rutinaRepository;

    public List<Rutina> findAll() {
        return rutinaRepository.findAll();
    }

    public Rutina findById(Long id) {
        return rutinaRepository.findById(id).orElse(null);
    }

    public Rutina save(Rutina rutina) {
        return rutinaRepository.save(rutina);
    }

    public void deleteById(Long id) {
        rutinaRepository.deleteById(id);
    }
}
