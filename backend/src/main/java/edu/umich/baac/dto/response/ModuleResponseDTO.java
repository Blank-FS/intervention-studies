package edu.umich.baac.dto.response;

import edu.umich.baac.model.module.Module;
import lombok.Data;

@Data
public class ModuleResponseDTO {
    private Long id;
    private String title;
    private String paragraph;
    private String videoPath;

    public ModuleResponseDTO(Module module) {
        this.id=module.getId();
        this.title=module.getTitle();
        this.paragraph=module.getParagraph();
        this.videoPath=module.getVideoPath();
    }
}
