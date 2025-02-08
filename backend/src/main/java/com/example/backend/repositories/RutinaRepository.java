package com.example.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.entity.Rutina;

public interface RutinaRepository extends JpaRepository<Rutina, Long> {
    List<Rutina> findByNombreContaining(String nombre);
}