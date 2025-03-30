package com.example.backend.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.backend.dto.RutinaEjercicioDTO;
import com.example.backend.models.entity.RutinaEjercicio;

@Mapper
public interface RutinaEjercicioMapper {
    
    @Mapping(target = "rutinaDiaId", source = "rutinaDia.id")
    @Mapping(target = "ejercicioId", source = "ejercicio.id")
    @Mapping(target = "ejercicioNombre", source = "ejercicio.nombre")
    @Mapping(target = "ejercicioVideo", source = "ejercicio.video")
    RutinaEjercicioDTO toDTO(RutinaEjercicio rutinaEjercicio);
    
    List<RutinaEjercicioDTO> toDTOList(List<RutinaEjercicio> rutinaEjercicios);
    
    @Mapping(target = "rutinaDia.id", source = "rutinaDiaId")
    @Mapping(target = "ejercicio.id", source = "ejercicioId")
    RutinaEjercicio toEntity(RutinaEjercicioDTO dto);
    
    void updateEntityFromDTO(RutinaEjercicioDTO dto, @MappingTarget RutinaEjercicio rutinaEjercicio);
}