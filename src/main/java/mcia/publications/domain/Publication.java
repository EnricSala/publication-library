package mcia.publications.domain;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
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

	private List<String> authorIds;

	private String publisherId;

	private String url;

	private String reference;

	private @TextScore float score;

}
