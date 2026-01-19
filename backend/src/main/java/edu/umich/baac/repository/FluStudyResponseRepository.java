package edu.umich.baac.repository;

import edu.umich.baac.model.FluStudyResponse;
import edu.umich.baac.model.module.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FluStudyResponseRepository extends JpaRepository<FluStudyResponse, Long> {
    boolean existsByProlificIdAndStudyIdAndSessionId(
            String prolificId,
            String studyId,
            String sessionId
    );
    Optional<FluStudyResponse> findByProlificIdAndStudyIdAndSessionId(
            String prolificId,
            String studyId,
            String sessionId
    );
}
