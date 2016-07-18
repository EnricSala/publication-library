package mcia.publications.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import mcia.publications.domain.Publisher;

@Data
@AllArgsConstructor
public class PublisherSummary {

	private Publisher publisher;
	private int count;

}
