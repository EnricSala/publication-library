package mcia.publications.domain;

import lombok.Data;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Size;

@Data
@Document
public class Author {

	private @Id String id;

	@NotEmpty
	@Size(max = 100)
	private String fullname;

	@NotEmpty
	@Size(max = 100)
	private String email;

	@NotEmpty
	@Size(max = 200)
	private String photo;

	@NotEmpty
	@Size(max = 20)
	private String status;

}
