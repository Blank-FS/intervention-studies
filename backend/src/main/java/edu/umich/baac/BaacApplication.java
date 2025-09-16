package edu.umich.baac;

import edu.umich.baac.config.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties(RsaKeyProperties.class)
@SpringBootApplication
public class BaacApplication {

	public static void main(String[] args) {
		SpringApplication.run(BaacApplication.class, args);
	}

}
