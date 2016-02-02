package mcia.publications.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document
public class Author {

	private @Id String id;

	private String fullname;

	private String email;

	private String photo;

}
