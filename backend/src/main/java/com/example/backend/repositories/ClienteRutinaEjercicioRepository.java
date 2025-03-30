package com.example.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.entity.ClienteRutinaEjercicio;

public interface ClienteRutinaEjercicioRepository extends JpaRepository<ClienteRutinaEjercicio, Long> {
    List<ClienteRutinaEjercicio> findByClienteRutinaDiaId(Long clienteRutinaDiaId);
    
    // Como eliminamos la relación directa a clienteRutina, usamos la siguiente consulta
    @Query("SELECT cre FROM ClienteRutinaEjercicio cre " +
           "WHERE cre.clienteRutinaDia.clienteRutina.id = :clienteRutinaId")
    List<ClienteRutinaEjercicio> findByClienteRutinaId(@Param("clienteRutinaId") Long clienteRutinaId);
    
    void deleteByClienteRutinaDiaId(Long clienteRutinaDiaId);
}