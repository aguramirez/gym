package com.example.backend.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.backend.dto.ClienteRutinaDTO;
import com.example.backend.dto.ClienteRutinaResumenDTO;
import com.example.backend.models.entity.ClienteRutina;

@Mapper(uses = {ClienteRutinaDiaMapper.class})
public interface ClienteRutinaMapper {
    
    // Mapeo completo de entidad a DTO incluyendo días y ejercicios
    @Mapping(target = "clienteId", source = "cliente.id")
    @Mapping(target = "rutinaId", source = "rutina.id")
    ClienteRutinaDTO toDTO(ClienteRutina clienteRutina);
    
    // Método que falta: Convertir lista de entidades a lista de DTOs
    List<ClienteRutinaDTO> toDTOList(List<ClienteRutina> clienteRutinas);
    
    // Mapeo resumido para mostrar listados sin todos los detalles
    @Mapping(target = "rutinaId", source = "rutina.id")
    @Mapping(target = "rutinaOriginalNombre", source = "rutina.nombre")
    @Mapping(target = "cantidadDias", expression = "java(clienteRutina.getClienteRutinaDias().size())")
    ClienteRutinaResumenDTO toResumenDTO(ClienteRutina clienteRutina);
    
    List<ClienteRutinaResumenDTO> toResumenDTOList(List<ClienteRutina> clienteRutinas);
    
    // DTO a entidad
    @Mapping(target = "cliente.id", source = "clienteId")
    @Mapping(target = "rutina.id", source = "rutinaId")
    ClienteRutina toEntity(ClienteRutinaDTO dto);
    
    // Actualizar entidad existente
    void updateEntityFromDTO(ClienteRutinaDTO dto, @MappingTarget ClienteRutina clienteRutina);
}