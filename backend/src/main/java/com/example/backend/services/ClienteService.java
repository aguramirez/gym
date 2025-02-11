package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.entity.Cliente;
import com.example.backend.repositories.ClienteRepository;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    public Cliente findById(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public void deleteById(Long id) {
        clienteRepository.deleteById(id);
    }

    public List<Cliente> findByNombreOrDni(String nombre, String dni) {
        return clienteRepository.findByNombreContainingOrDniContaining(nombre, dni);
    }

    public Cliente editarCliente(Long id, Cliente clienteActualizado) {
        // Buscar el cliente existente por su ID
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Actualizar los campos del cliente existente con los datos del cliente actualizado
        clienteExistente.setNombre(clienteActualizado.getNombre());
        clienteExistente.setDni(clienteActualizado.getDni());
        clienteExistente.setTelefono(clienteActualizado.getTelefono());
        clienteExistente.setRol(clienteActualizado.getRol());

        // Guardar el cliente actualizado en la base de datos
        return clienteRepository.save(clienteExistente);
    }
}
