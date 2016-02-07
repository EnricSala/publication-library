package mcia.publications.domain;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document
public class Publisher {

	private @Id String id;

	@NotEmpty
	@Size(max = 20)
	private String type;

	@NotEmpty
	@Size(max = 200)
	private String fullname;

	@NotEmpty
	@Size(max = 20)
	private String acronym;

}
