package com.example.backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotBlank(message = "El DNI es obligatorio")
    // Eliminamos la validación de patrón estricto para permitir mayor flexibilidad
    private String dni;
    
    @NotBlank(message = "El teléfono es obligatorio")
    // Modificamos el patrón para ser más flexible (hasta 15 dígitos)
    @Pattern(regexp = "^[0-9]{1,15}$", message = "El teléfono debe contener solo dígitos (máximo 15)")
    private String telefono;
    
    private String rol;
    
    private List<ClienteRutinaResumenDTO> clienteRutinas;
}