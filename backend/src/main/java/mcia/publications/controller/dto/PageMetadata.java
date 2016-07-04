package mcia.publications.controller.dto;

import org.springframework.data.domain.Page;

import lombok.Data;

@Data
public class PageMetadata {

	private long totalElements;

	private int totalPages;

	private int page;

	private int size;

	private boolean last;

	public static PageMetadata from(Page<?> page) {
		PageMetadata meta = new PageMetadata();
		meta.setTotalElements(page.getTotalElements());
		meta.setTotalPages(page.getTotalPages());
		meta.setPage(page.getNumber());
		meta.setSize(page.getSize());
		meta.setLast(page.isLast());
		return meta;
	}

}
