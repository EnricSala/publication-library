package mcia.publications.controller.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthorSummary {

	private String authorId;
	private Map<String, List<Count>> counts;

	@Data
	@AllArgsConstructor
	public static class Count {
		private int pos;
		private int count;
	}

}
