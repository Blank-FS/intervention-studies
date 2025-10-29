package edu.umich.baac.repository.module;

import edu.umich.baac.model.module.Response;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResponseRepository extends JpaRepository<Response, Long> {
    Optional<Response> findByUserIdAndQuestionId(Long userId, Long questionId);
    List<Response> findByUserIdAndQuestionModuleId(Long userId, Long moduleId);
}

