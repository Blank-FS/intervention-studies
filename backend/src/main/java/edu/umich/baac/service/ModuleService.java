package edu.umich.baac.service;

import edu.umich.baac.model.module.Module;
import edu.umich.baac.repository.module.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    public Module createModule(String title, String paragraph, MultipartFile video) throws Exception {
        if (video == null || video.isEmpty()) {
            throw new IllegalArgumentException("Video file is missing");
        }

        Path uploadDir = Paths.get("data/videos");
        Files.createDirectories(uploadDir);

        String filename = UUID.randomUUID() + "_" + video.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        Files.copy(video.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Module module = new Module();
        module.setTitle(title);
        module.setParagraph(paragraph);
        module.setVideoUrl(filename);

        return moduleRepo.save(module);
    }

    public List<Module> getModules() {
        return moduleRepo.findAll();
    }
}
