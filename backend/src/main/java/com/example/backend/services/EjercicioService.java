package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.entity.Ejercicio;
import com.example.backend.repositories.EjercicioRepository;

@Service
public class EjercicioService {
    @Autowired
    private EjercicioRepository ejercicioRepository;

    public List<Ejercicio> findAll() {
        return ejercicioRepository.findAll();
    }

    public Ejercicio findById(Long id) {
        return ejercicioRepository.findById(id).orElse(null);
    }

    public Ejercicio save(Ejercicio ejercicio) {
        return ejercicioRepository.save(ejercicio);
    }

    public void deleteById(Long id) {
        ejercicioRepository.deleteById(id);
    }

    public List<Ejercicio> findByNombre(String nombre) {
        return ejercicioRepository.findByNombreContaining(nombre);
    }
}