package com.example.backend.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.backend.dto.ClienteRutinaDiaDTO;
import com.example.backend.models.entity.ClienteRutinaDia;

@Mapper(uses = {ClienteRutinaEjercicioMapper.class})
public interface ClienteRutinaDiaMapper {
    
    @Mapping(target = "clienteRutinaId", source = "clienteRutina.id")
    ClienteRutinaDiaDTO toDTO(ClienteRutinaDia clienteRutinaDia);
    
    List<ClienteRutinaDiaDTO> toDTOList(List<ClienteRutinaDia> clienteRutinaDias);
    
    @Mapping(target = "clienteRutina.id", source = "clienteRutinaId")
    ClienteRutinaDia toEntity(ClienteRutinaDiaDTO dto);
    
    void updateEntityFromDTO(ClienteRutinaDiaDTO dto, @MappingTarget ClienteRutinaDia clienteRutinaDia);
}