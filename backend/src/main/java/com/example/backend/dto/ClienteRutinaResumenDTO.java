package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRutinaResumenDTO {
    private Long id;
    private String nombre;
    private Long rutinaId;
    private String rutinaOriginalNombre;
    private int cantidadDias;
}