package edu.umich.baac.model.progress;

import edu.umich.baac.enums.ModuleProgressType;
import edu.umich.baac.model.User;
import edu.umich.baac.model.module.Module;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="module_progress")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ModuleProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Module module;

    private ModuleProgressType progress;
}
