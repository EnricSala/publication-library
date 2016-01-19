package mcia.publications.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.TextScore;

import lombok.Data;

@Data
@Document
public class Publisher {

	private @Id String id;

	private String type;

	private @TextIndexed String fullname;

	private @TextIndexed String acronym;

	private @TextScore float score;

}
