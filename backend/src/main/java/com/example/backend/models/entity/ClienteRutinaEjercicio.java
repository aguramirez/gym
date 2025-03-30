package com.example.backend.models.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "cliente_rutina_ejercicios")
public class ClienteRutinaEjercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int reps;
    private int sets;
    private String notas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rutina_ejercicio_id")
    @JsonIgnoreProperties("rutinaDia")
    private RutinaEjercicio rutinaEjercicio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_rutina_dia_id")
    @JsonIgnoreProperties("clienteRutinaEjercicios")
    private ClienteRutinaDia clienteRutinaDia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ejercicio_id", nullable = false)
    private Ejercicio ejercicio;
    
    // Eliminado la relación directa con ClienteRutina ya que es redundante
    // Se puede obtener a través de clienteRutinaDia.getClienteRutina()
}