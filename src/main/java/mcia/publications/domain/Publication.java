package mcia.publications.domain;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.TextScore;

import lombok.Data;

@Data
@Document
public class Publication {

	private @Id String id;

	@NotNull
	private Date publishDate;

	@NotEmpty
	@Size(max = 200)
	private @TextIndexed String title;

	@Size(max = 2000)
	private @TextIndexed String summary;

	@NotEmpty
	@Size(max = 10)
	private List<String> authorIds;

	@NotEmpty
	private String publisherId;

	@Size(max = 200)
	private String url;

	@Size(max = 500)
	private String reference;

	private @TextScore float score;

}
