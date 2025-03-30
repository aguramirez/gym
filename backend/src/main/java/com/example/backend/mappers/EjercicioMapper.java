package com.example.backend.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.example.backend.dto.EjercicioDTO;
import com.example.backend.models.entity.Ejercicio;

@Mapper
public interface EjercicioMapper {
    
    EjercicioDTO toDTO(Ejercicio ejercicio);
    
    List<EjercicioDTO> toDTOList(List<Ejercicio> ejercicios);
    
    Ejercicio toEntity(EjercicioDTO dto);
    
    void updateEntityFromDTO(EjercicioDTO dto, @MappingTarget Ejercicio ejercicio);
}