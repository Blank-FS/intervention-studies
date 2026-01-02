package edu.umich.baac.service;

import edu.umich.baac.model.Study;
import edu.umich.baac.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudyService {

    private final StudyRepository studyRepository;

    public Study getStudyByName(String name) {
        return studyRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Study not found: " + name));
    }

    public boolean isStudyActive(String name) {
        return getStudyByName(name).getActive();
    }

    @Transactional
    public Study setStudyActive(String name, boolean active) {
        Study study = getStudyByName(name);
        study.setActive(active);
        return study;
    }

    @Transactional
    public Study toggleStudyActive(String name) {
        Study study = getStudyByName(name);
        study.setActive(!study.getActive());
        return study;
    }
}
