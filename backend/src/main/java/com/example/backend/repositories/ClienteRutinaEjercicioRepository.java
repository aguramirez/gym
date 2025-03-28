package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.models.entity.ClienteRutinaEjercicio;

import jakarta.transaction.Transactional;

public interface ClienteRutinaEjercicioRepository extends JpaRepository<ClienteRutinaEjercicio, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM ClienteRutinaEjercicio cre WHERE cre.clienteRutina = :clienteRutina")
    void deleteByClienteRutina(@Param("clienteRutina") ClienteRutina clienteRutina);

    @Modifying
    @Transactional
    @Query("DELETE FROM ClienteRutinaEjercicio cre WHERE cre.clienteRutinaDia.id = :clienteRutinaDiaId")
    void deleteByClienteRutinaDiaId(@Param("clienteRutinaDiaId") Long clienteRutinaDiaId);

}
