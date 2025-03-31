package com.example.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.config.ProtectedUsersConfig;
import com.example.backend.exceptions.BusinessLogicException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.models.entity.Cliente;
import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.models.entity.Rutina;
import com.example.backend.repositories.ClienteRepository;

@Service
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    @Autowired
    private ProtectedUsersConfig protectedUsersConfig;

    @Transactional(readOnly = true)
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Cliente findById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
    }

    @Transactional
    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Transactional
    public void deleteById(Long id) {
        Cliente cliente = findById(id); // Validar que existe
        
        // Verificar si el cliente es un usuario protegido
        if (protectedUsersConfig.isProtectedUser(cliente.getDni())) {
            throw new BusinessLogicException("Este usuario está protegido y no puede ser eliminado");
        }
        
        clienteRepository.delete(cliente);
    }

    @Transactional(readOnly = true)
    public List<Cliente> findByNombreOrDni(String nombre, String dni) {
        return clienteRepository.findByNombreContainingOrDniContaining(nombre, dni);
    }

    @Transactional
    public Cliente editarCliente(Long id, Cliente clienteActualizado) {
        // Buscar el cliente existente por su ID
        Cliente clienteExistente = findById(id);
        
        // Verificar si el cliente es un usuario protegido
        boolean isProtected = protectedUsersConfig.isProtectedUser(clienteExistente.getDni());
        
        if (isProtected) {
            // Si es un usuario protegido, verificar que no se estén degradando sus privilegios
            if (!"ADMIN".equals(clienteActualizado.getRol())) {
                throw new BusinessLogicException("No se puede cambiar el rol de un usuario protegido. Debe mantener el rol ADMIN.");
            }
            
            // Verificar que no se esté cambiando el DNI de un usuario protegido
            if (!clienteExistente.getDni().equals(clienteActualizado.getDni())) {
                throw new BusinessLogicException("No se puede cambiar el DNI de un usuario protegido.");
            }
        }

        // Actualizar los campos del cliente existente con los datos del cliente actualizado
        clienteExistente.setNombre(clienteActualizado.getNombre());
        // Permitir actualizar el DNI solo si no es un usuario protegido
        if (!isProtected) {
            clienteExistente.setDni(clienteActualizado.getDni());
        }
        clienteExistente.setTelefono(clienteActualizado.getTelefono());
        clienteExistente.setRol(clienteActualizado.getRol());

        // Guardar el cliente actualizado en la base de datos
        return clienteRepository.save(clienteExistente);
    }

    @Transactional(readOnly = true)
    public List<Rutina> obtenerRutinasDeCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findByIdWithRutinas(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + clienteId));
        
        return cliente.getClienteRutinas().stream()
                .map(ClienteRutina::getRutina)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public boolean existePorDni(String dni) {
        return clienteRepository.findByDni(dni).isPresent();
    }
}