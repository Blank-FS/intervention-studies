package edu.umich.baac.repository.module;

import edu.umich.baac.model.module.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {}
