package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.entity.RutinaDia;
import com.example.backend.repositories.RutinaDiaRepository;

@Service
public class RutinaDiaService {
    @Autowired
    private RutinaDiaRepository rutinaDiaRepository;

    public List<RutinaDia> findAll() {
        return rutinaDiaRepository.findAll();
    }

    public RutinaDia findById(Long id) {
        return rutinaDiaRepository.findById(id).orElse(null);
    }

    public RutinaDia save(RutinaDia rutinaDia) {
        return rutinaDiaRepository.save(rutinaDia);
    }

    public void deleteById(Long id) {
        rutinaDiaRepository.deleteById(id);
    }
}
