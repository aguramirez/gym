package com.example.backend.models.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
public class ClienteRutinaEjercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String notas;

    @ManyToOne
    @JoinColumn(name = "rutina_ejercicio_id")
    private RutinaEjercicio rutinaEjercicio;

    @ManyToOne
    @JoinColumn(name = "cliente_rutina_dia_id")
    private ClienteRutinaDia clienteRutinaDia;

    @ManyToOne
    @JoinColumn(name = "cliente_rutina_id")
    private ClienteRutina clienteRutina;
}
