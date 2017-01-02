package mcia.publications.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import mcia.publications.domain.Author;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class AuthorSummary {

	private final Author author;
	private final Map<String, List<Count>> contributions;

	@Data
	@AllArgsConstructor
	public static class Count {
		private final int pos;
		private final int count;
	}

}
