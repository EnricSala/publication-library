package mcia.publications.domain;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.TextScore;

import lombok.Data;

@Data
@Document
public class Publication {

	private @Id String id;

	private Date publishDate;

	private @TextIndexed String title;

	private @TextIndexed String summary;

	private @DBRef List<Author> authors;

	private @DBRef Publisher publisher;

	private String url;

	private String citation;

	private @TextScore float score;

}
