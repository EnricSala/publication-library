package mcia.publications.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.TextScore;

import lombok.Data;

@Data
@Document
public class Author {

	private @Id String id;

	private @TextIndexed String fullname;

	private @TextIndexed String email;

	private String photo;

	private @TextScore float score;

}
