package mcia.publications.controller.dto;

import java.util.Collections;
import java.util.List;

import org.springframework.data.domain.Page;

import lombok.Data;
import org.springframework.data.domain.PageImpl;

@Data
public class PageableResult<T> {

	private List<T> content;

	private PageMetadata metadata;

	public static <T> PageableResult<T> from(Page<T> page) {
		PageableResult<T> result = new PageableResult<>();
		result.setContent(page.getContent());
		result.setMetadata(PageMetadata.from(page));
		return result;
	}

	public static <T> PageableResult<T> empty() {
		return from(new PageImpl<>(Collections.emptyList()));
	}

}
