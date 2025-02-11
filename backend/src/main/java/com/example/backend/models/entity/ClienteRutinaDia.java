package com.example.backend.models.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
public class ClienteRutinaDia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @ManyToOne
    @JoinColumn(name = "cliente_rutina_id")
    private ClienteRutina clienteRutina;

    @OneToMany(mappedBy = "clienteRutinaDia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClienteRutinaEjercicio> clienteRutinaEjercicios;
}
