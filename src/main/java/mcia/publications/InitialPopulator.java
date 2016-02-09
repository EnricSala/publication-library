package mcia.publications;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import mcia.publications.domain.Author;
import mcia.publications.domain.Publication;
import mcia.publications.domain.Publisher;
import mcia.publications.repository.AuthorRepository;
import mcia.publications.repository.PublicationRepository;
import mcia.publications.repository.PublisherRepository;

@Component
@ConfigurationProperties(prefix = "init")
@Slf4j
public class InitialPopulator implements ApplicationRunner {

	private @Setter String publicationsFile = "";
	private @Setter String authorsFile = "";
	private @Setter String publishersFile = "";

	private final PublicationRepository publicationRepository;
	private final AuthorRepository authorRepository;
	private final PublisherRepository publisherRepository;

	private final ObjectMapper mapper = new ObjectMapper();

	@Autowired
	public InitialPopulator(PublicationRepository publicationRepository,
			AuthorRepository authorRepository, PublisherRepository publisherRepository) {
		this.publicationRepository = publicationRepository;
		this.authorRepository = authorRepository;
		this.publisherRepository = publisherRepository;
	}

	@Override
	public void run(ApplicationArguments args) throws Exception {
		initIfEmpty(authorRepository, authorsFile, Author.class);
		initIfEmpty(publisherRepository, publishersFile, Publisher.class);
		initIfEmpty(publicationRepository, publicationsFile, Publication.class);
	}

	private <T> void initIfEmpty(CrudRepository<T, ?> repository, String filePath, Class<T> type) throws IOException {
		if (!filePath.isEmpty() && repository.count() < 1) {
			File file = new File(filePath);
			if (!file.exists()) {
				log.warn("Ignoring {} repository initialization, cannot find file: {}", type.getSimpleName(), file);
				return;
			}
			List<T> data = loadResource(file, type);
			repository.save(data);
			log.info("Initialized {} repository with {} elements", type.getSimpleName(), data.size());
		}
	}

	private <T> List<T> loadResource(File file, Class<T> type) throws IOException {
		return mapper.readValue(file, mapper.getTypeFactory().constructCollectionType(List.class, type));
	}

}
