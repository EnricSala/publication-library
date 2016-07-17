package mcia.publications.controller.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthorSummary {

	private final String authorId;
	private final Map<String, List<Count>> counts;

	@Data
	@AllArgsConstructor
	public static class Count {
		private final int pos;
		private final int count;
	}

}
