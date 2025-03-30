package com.example.backend.models.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "rutina_dias")
public class RutinaDia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rutina_id")
    @JsonIgnoreProperties("rutinaDias")
    private Rutina rutina;

    @OneToMany(mappedBy = "rutinaDia", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("rutinaDia")
    private List<RutinaEjercicio> rutinaEjercicios = new ArrayList<>();
    
    // Helper methods
    public void addRutinaEjercicio(RutinaEjercicio ejercicio) {
        rutinaEjercicios.add(ejercicio);
        ejercicio.setRutinaDia(this);
    }
    
    public void removeRutinaEjercicio(RutinaEjercicio ejercicio) {
        rutinaEjercicios.remove(ejercicio);
        ejercicio.setRutinaDia(null);
    }
}