package com.example.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.entity.RutinaEjercicio;

public interface RutinaEjercicioRepository extends JpaRepository<RutinaEjercicio, Long> {
    List<RutinaEjercicio> findByRutinaDiaId(Long rutinaDiaId);
    
    // Contar cuántas rutinas usan un ejercicio específico
    @Query("SELECT COUNT(re) FROM RutinaEjercicio re WHERE re.ejercicio.id = :ejercicioId")
    long countByEjercicioId(@Param("ejercicioId") Long ejercicioId);
}