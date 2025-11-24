package edu.umich.baac.service;

import edu.umich.baac.dto.form.ModuleFormDTO;
import edu.umich.baac.dto.response.ModuleResponseDTO;
import edu.umich.baac.model.module.Module;
import edu.umich.baac.repository.module.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepo;

    public List<ModuleResponseDTO> getModules() {
        return moduleRepo.findAll().stream().map(ModuleResponseDTO::new).toList();
    }

    @Transactional
    public ModuleResponseDTO createModule(ModuleFormDTO formData) throws IOException {
        MultipartFile video = formData.getVideo();

        if (video == null || video.isEmpty())
            throw new IllegalArgumentException("Video file is missing");

        Path uploadDir = Paths.get("uploads/videos");
        Files.createDirectories(uploadDir);

        String filename = UUID.randomUUID() + "_" + video.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        Files.copy(video.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Module module = Module.builder()
                .title(formData.getTitle())
                .paragraph(formData.getParagraph())
                .videoPath("uploads/videos/" + filename)
                .build();

        return new ModuleResponseDTO(moduleRepo.save(module));
    }

    @Transactional
    public boolean deleteModuleById(Long id) {
        Module module = moduleRepo.findById(id).orElse(null);
        if (module == null) return false;

        // Delete video file
        Path filePath = Paths.get(module.getVideoPath());
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + filePath, e);
        }

        // Delete DB record
        moduleRepo.delete(module);
        return true;

    }


}
