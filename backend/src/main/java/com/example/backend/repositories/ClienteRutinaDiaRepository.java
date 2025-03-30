package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.entity.ClienteRutinaDia;

public interface ClienteRutinaDiaRepository extends JpaRepository<ClienteRutinaDia, Long> {
    List<ClienteRutinaDia> findByClienteRutinaId(Long clienteRutinaId);
    
    // Consulta optimizada para cargar un día con sus ejercicios
    @Query("SELECT crd FROM ClienteRutinaDia crd " +
           "LEFT JOIN FETCH crd.clienteRutinaEjercicios " +
           "WHERE crd.id = :id")
    Optional<ClienteRutinaDia> findByIdWithEjercicios(@Param("id") Long id);
    
    void deleteByClienteRutinaId(Long clienteRutinaId);
}