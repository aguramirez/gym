package com.example.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.backend.models.entity.Cliente;
import com.example.backend.models.entity.ClienteRutina;
import com.example.backend.models.entity.ClienteRutinaEjercicio;
import com.example.backend.repositories.ClienteRepository;
import com.example.backend.repositories.ClienteRutinaEjercicioRepository;
import com.example.backend.repositories.ClienteRutinaRepository;

/**
 * Utilidades para verificar permisos de seguridad relacionados con usuarios
 */
@Component
public class SecurityUtils {

    @Autowired
    private ClienteRepository clienteRepository;
    
    @Autowired
    private ClienteRutinaRepository clienteRutinaRepository;
    
    @Autowired
    private ClienteRutinaEjercicioRepository clienteRutinaEjercicioRepository;

    /**
     * Verifica si el usuario autenticado actualmente es el dueño del recurso 
     * identificado por el clienteId
     * 
     * @param clienteId ID del cliente a verificar
     * @return true si el usuario actual es dueño del recurso, false en caso contrario
     */
    public boolean isCurrentUser(Long clienteId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        // El nombre de usuario en nuestra aplicación es el DNI
        String currentUserDni = auth.getName();
        
        // Buscar el cliente por ID para obtener su DNI y comparar
        return clienteRepository.findById(clienteId)
                .map(cliente -> cliente.getDni().equals(currentUserDni))
                .orElse(false);
    }
    
    /**
     * Verifica si el usuario autenticado actualmente es el dueño de una ClienteRutina
     * 
     * @param clienteRutinaId ID de la ClienteRutina a verificar
     * @return true si el usuario actual es dueño del recurso, false en caso contrario
     */
    public boolean isClienteRutinaOwner(Long clienteRutinaId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String currentUserDni = auth.getName();
        
        // Buscar la ClienteRutina y verificar si pertenece al usuario actual
        return clienteRutinaRepository.findById(clienteRutinaId)
                .map(clienteRutina -> clienteRutina.getCliente().getDni().equals(currentUserDni))
                .orElse(false);
    }
    
    /**
     * Verifica si el usuario autenticado actualmente es el dueño de un ClienteRutinaEjercicio
     * 
     * @param ejercicioId ID del ClienteRutinaEjercicio a verificar
     * @return true si el usuario actual es dueño del recurso, false en caso contrario
     */
    public boolean isClienteRutinaEjercicioOwner(Long ejercicioId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String currentUserDni = auth.getName();
        
        // Buscar el ejercicio y navegar por las relaciones hasta llegar al cliente
        return clienteRutinaEjercicioRepository.findById(ejercicioId)
                .map(ejercicio -> {
                    // Navegar por las relaciones: ejercicio -> día -> rutina -> cliente -> dni
                    return ejercicio.getClienteRutinaDia() != null &&
                           ejercicio.getClienteRutinaDia().getClienteRutina() != null &&
                           ejercicio.getClienteRutinaDia().getClienteRutina().getCliente() != null &&
                           ejercicio.getClienteRutinaDia().getClienteRutina().getCliente().getDni().equals(currentUserDni);
                })
                .orElse(false);
    }
}