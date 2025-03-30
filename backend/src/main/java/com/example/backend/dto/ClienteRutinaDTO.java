package com.example.backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRutinaDTO {
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotNull(message = "El cliente es obligatorio")
    private Long clienteId;
    
    @NotNull(message = "La rutina es obligatoria")
    private Long rutinaId;
    
    private List<ClienteRutinaDiaDTO> clienteRutinaDias;
}