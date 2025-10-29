package edu.umich.baac.repository.module;

import edu.umich.baac.model.module.Module;
import edu.umich.baac.model.module.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByModule(Module module);
}
