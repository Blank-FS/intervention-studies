package edu.umich.baac.repository.progress;

import edu.umich.baac.model.User;
import edu.umich.baac.model.module.Module;
import edu.umich.baac.model.progress.ModuleProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ModuleProgressRepository extends JpaRepository<ModuleProgress, Long> {
    Optional<ModuleProgress> findByUserAndModule(User user, Module module);
}
