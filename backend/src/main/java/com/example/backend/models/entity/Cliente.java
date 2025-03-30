package com.example.backend.models.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "clientes")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private String dni;
    private String telefono;
    private String rol;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("cliente")
    private List<ClienteRutina> clienteRutinas = new ArrayList<>();
    
    // Helper methods para manejar la relación bidireccional
    public void addClienteRutina(ClienteRutina clienteRutina) {
        clienteRutinas.add(clienteRutina);
        clienteRutina.setCliente(this);
    }
    
    public void removeClienteRutina(ClienteRutina clienteRutina) {
        clienteRutinas.remove(clienteRutina);
        clienteRutina.setCliente(null);
    }
}