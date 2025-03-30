package com.example.backend.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.backend.dto.RutinaDTO;
import com.example.backend.models.entity.Rutina;

@Mapper(uses = {RutinaDiaMapper.class})
public interface RutinaMapper {
    
    @Mapping(target = "clienteId", source = "cliente.id")
    RutinaDTO toDTO(Rutina rutina);
    
    List<RutinaDTO> toDTOList(List<Rutina> rutinas);
    
    @Mapping(target = "cliente.id", source = "clienteId")
    Rutina toEntity(RutinaDTO dto);
    
    void updateEntityFromDTO(RutinaDTO dto, @MappingTarget Rutina rutina);
}