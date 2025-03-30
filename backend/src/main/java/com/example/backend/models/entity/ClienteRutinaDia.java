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
@Table(name = "cliente_rutina_dias")
public class ClienteRutinaDia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_rutina_id")
    @JsonIgnoreProperties("clienteRutinaDias")
    private ClienteRutina clienteRutina;

    @OneToMany(mappedBy = "clienteRutinaDia", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("clienteRutinaDia")
    private List<ClienteRutinaEjercicio> clienteRutinaEjercicios = new ArrayList<>();
    
    // Helper methods
    public void addClienteRutinaEjercicio(ClienteRutinaEjercicio ejercicio) {
        clienteRutinaEjercicios.add(ejercicio);
        ejercicio.setClienteRutinaDia(this);
    }
    
    public void removeClienteRutinaEjercicio(ClienteRutinaEjercicio ejercicio) {
        clienteRutinaEjercicios.remove(ejercicio);
        ejercicio.setClienteRutinaDia(null);
    }
}