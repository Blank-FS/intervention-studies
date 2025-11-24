package edu.umich.baac.service;

import edu.umich.baac.enums.ModuleProgressType;
import edu.umich.baac.model.User;
import edu.umich.baac.model.module.Module;
import edu.umich.baac.model.progress.ModuleProgress;
import edu.umich.baac.repository.progress.ModuleProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProgressService {
    private final ModuleProgressRepository moduleProgressRepo;

    @Transactional
    public ModuleProgress getOrCreateProgress(User user, Module module) {
        return moduleProgressRepo
                .findByUserAndModule(user, module)
                .orElseGet(() -> {
                    ModuleProgress progress = ModuleProgress.builder()
                            .user(user)
                            .module(module)
                            .progress(ModuleProgressType.NOT_STARTED)
                            .build();
                    return moduleProgressRepo.save(progress);
                });
    }

    @Transactional
    public ModuleProgress updateProgress(User user, Module module, ModuleProgressType newStatus) {
        ModuleProgress progress = getOrCreateProgress(user, module);
        progress.setProgress(newStatus);
        return moduleProgressRepo.save(progress);
    }
}
