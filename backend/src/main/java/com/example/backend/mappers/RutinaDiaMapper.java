package com.example.backend.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.backend.dto.RutinaDiaDTO;
import com.example.backend.models.entity.RutinaDia;

@Mapper(uses = {RutinaEjercicioMapper.class})
public interface RutinaDiaMapper {
    
    @Mapping(target = "rutinaId", source = "rutina.id")
    RutinaDiaDTO toDTO(RutinaDia rutinaDia);
    
    List<RutinaDiaDTO> toDTOList(List<RutinaDia> rutinaDias);
    
    @Mapping(target = "rutina.id", source = "rutinaId")
    RutinaDia toEntity(RutinaDiaDTO dto);
    
    void updateEntityFromDTO(RutinaDiaDTO dto, @MappingTarget RutinaDia rutinaDia);
}