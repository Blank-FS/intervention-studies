package edu.umich.baac.repository.module;

import edu.umich.baac.model.module.Module;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<Module, Long> {}