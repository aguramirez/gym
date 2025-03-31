package com.example.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

/**
 * Configuración para usuarios protegidos que no pueden ser eliminados
 * ni modificados negativamente a través de la API.
 */
@Component
public class ProtectedUsersConfig {
    // Lista de DNIs de usuarios protegidos
    private static final List<String> PROTECTED_USER_DNIS = Arrays.asList("41731091", "1");
    
    /**
     * Verifica si un DNI corresponde a un usuario protegido
     * @param dni el DNI a verificar
     * @return true si es un usuario protegido, false en caso contrario
     */
    public boolean isProtectedUser(String dni) {
        return PROTECTED_USER_DNIS.contains(dni);
    }
}