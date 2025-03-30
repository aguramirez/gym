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
@Table(name = "rutinas")
public class Rutina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    @JsonIgnoreProperties("clienteRutinas")
    private Cliente cliente;  // Cliente creador de la rutina (optional)

    @OneToMany(mappedBy = "rutina", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("rutina")
    private List<RutinaDia> rutinaDias = new ArrayList<>();
    
    // Helper methods
    public void addRutinaDia(RutinaDia dia) {
        rutinaDias.add(dia);
        dia.setRutina(this);
    }
    
    public void removeRutinaDia(RutinaDia dia) {
        rutinaDias.remove(dia);
        dia.setRutina(null);
    }
}