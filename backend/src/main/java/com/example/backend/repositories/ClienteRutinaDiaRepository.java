package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.models.entity.ClienteRutinaDia;

import jakarta.transaction.Transactional;

public interface ClienteRutinaDiaRepository extends JpaRepository<ClienteRutinaDia, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM ClienteRutinaDia crd WHERE crd.clienteRutina = :clienteRutina")
    void deleteByClienteRutina(@Param("clienteRutina") ClienteRutina clienteRutina);
}
