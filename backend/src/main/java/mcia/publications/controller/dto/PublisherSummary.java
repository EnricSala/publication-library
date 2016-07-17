package mcia.publications.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class PublisherSummary {

	private final String type;
	private final Map<String, Integer> counts;

}
