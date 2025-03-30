package com.example.backend.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.backend.dto.ClienteRutinaEjercicioDTO;
import com.example.backend.models.entity.ClienteRutinaEjercicio;

@Mapper
public interface ClienteRutinaEjercicioMapper {
    
    @Mapping(target = "clienteRutinaDiaId", source = "clienteRutinaDia.id")
    @Mapping(target = "ejercicioId", source = "ejercicio.id")
    @Mapping(target = "ejercicioNombre", source = "ejercicio.nombre")
    @Mapping(target = "ejercicioVideo", source = "ejercicio.video")
    ClienteRutinaEjercicioDTO toDTO(ClienteRutinaEjercicio clienteRutinaEjercicio);
    
    List<ClienteRutinaEjercicioDTO> toDTOList(List<ClienteRutinaEjercicio> clienteRutinaEjercicios);
    
    @Mapping(target = "clienteRutinaDia.id", source = "clienteRutinaDiaId")
    @Mapping(target = "ejercicio.id", source = "ejercicioId")
    ClienteRutinaEjercicio toEntity(ClienteRutinaEjercicioDTO dto);
    
    void updateEntityFromDTO(ClienteRutinaEjercicioDTO dto, @MappingTarget ClienteRutinaEjercicio clienteRutinaEjercicio);
}