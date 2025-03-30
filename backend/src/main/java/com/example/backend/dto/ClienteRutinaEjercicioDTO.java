package com.example.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRutinaEjercicioDTO {
    private Long id;
    
    @Min(value = 1, message = "Las repeticiones deben ser al menos 1")
    private int reps;
    
    @Min(value = 1, message = "Las series deben ser al menos 1")
    private int sets;
    
    private String notas;
    
    private Long clienteRutinaDiaId;
    
    @NotNull(message = "El ejercicio es obligatorio")
    private Long ejercicioId;
    
    // Datos para mostrar información del ejercicio
    private String ejercicioNombre;
    private String ejercicioVideo;
}