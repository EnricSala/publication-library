package mcia.publications.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document
public class Publisher {

	private @Id String id;

	private String type;

	private String fullname;

	private String acronym;

}
