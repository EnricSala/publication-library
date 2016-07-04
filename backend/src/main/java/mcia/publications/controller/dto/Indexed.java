package mcia.publications.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Indexed<T> {

	private final int index;
	private final T value;

}
