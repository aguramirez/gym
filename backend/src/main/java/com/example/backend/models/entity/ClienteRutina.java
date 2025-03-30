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

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "cliente_rutinas")
public class ClienteRutina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    @JsonIgnoreProperties("clienteRutinas")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rutina_id")
    @JsonIgnoreProperties({"cliente", "rutinaDias"})
    private Rutina rutina;

    @OneToMany(mappedBy = "clienteRutina", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("clienteRutina")
    private List<ClienteRutinaDia> clienteRutinaDias = new ArrayList<>();
    
    // Helper methods
    public void addClienteRutinaDia(ClienteRutinaDia dia) {
        clienteRutinaDias.add(dia);
        dia.setClienteRutina(this);
    }
    
    public void removeClienteRutinaDia(ClienteRutinaDia dia) {
        clienteRutinaDias.remove(dia);
        dia.setClienteRutina(null);
    }
}