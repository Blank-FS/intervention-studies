package edu.umich.baac.dto.response;

import edu.umich.baac.enums.ModuleProgressType;

public record ModuleProgressResponseDTO(Long userId, Long moduleId, ModuleProgressType progress) {
}
