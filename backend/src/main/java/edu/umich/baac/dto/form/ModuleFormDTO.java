package edu.umich.baac.dto.form;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ModuleFormDTO {
    private String title;
    private String paragraph;
    private MultipartFile video;
}
