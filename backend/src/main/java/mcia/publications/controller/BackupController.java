package mcia.publications.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.fasterxml.jackson.core.JsonGenerator.Feature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import lombok.extern.slf4j.Slf4j;
import mcia.publications.domain.Author;
import mcia.publications.domain.Publication;
import mcia.publications.domain.Publisher;
import mcia.publications.repository.AuthorRepository;
import mcia.publications.repository.PublicationRepository;
import mcia.publications.repository.PublisherRepository;
import rx.Observable;

@Controller
@Slf4j
public class BackupController implements InitializingBean {

	private static final String MEDIA_ZIP = "application/zip";
	private static final String DISPOSITION_TEMPLATE = "attachment; filename=\"%s_%s\"";
	private static final String DATE_FORMAT = "yyyy-MM-dd_HH-mm";
	private static final String FILE_NAME = "backup_publication_library.zip";

	@Autowired
	PublicationRepository publicationRepository;

	@Autowired
	AuthorRepository authorRepository;

	@Autowired
	PublisherRepository publisherRepository;

	private static final ObjectMapper mapper = new ObjectMapper();

	@Override
	public void afterPropertiesSet() throws Exception {
		mapper.disable(Feature.AUTO_CLOSE_TARGET);
		mapper.enable(SerializationFeature.INDENT_OUTPUT);
	}

	@RequestMapping(value = "/backup", method = RequestMethod.GET)
	public void downloadBackup(TimeZone timezone, HttpServletResponse response) {
		log.info("Preparing full backup...");

		String disposition = dispositionHeader(timezone);
		response.setHeader(HttpHeaders.CONTENT_DISPOSITION, disposition);
		response.setContentType(MEDIA_ZIP);
		log.debug("Set content-type: {}, disposition: {}", MEDIA_ZIP, disposition);

		try (ZipOutputStream zos = new ZipOutputStream(response.getOutputStream())) {
			addPublications(zos);
			addAuthors(zos);
			addPublishers(zos);
		} catch (IOException ioe) {
			log.error("Error downloading backup", ioe);
		}

		log.info("Finished sending backup");
	}

	private String dispositionHeader(TimeZone timezone) {
		SimpleDateFormat format = new SimpleDateFormat(DATE_FORMAT, Locale.ENGLISH);
		format.setTimeZone(timezone);
		String dateStr = format.format(new Date());
		return String.format(DISPOSITION_TEMPLATE, dateStr, FILE_NAME);
	}

	private void addPublications(ZipOutputStream zos) throws IOException {
		List<Publication> publications = toList(publicationRepository.findAll());
		log.debug("Writing {} publications to backup", publications.size());
		addJsonToZip("publications", publications, zos);
	}

	private void addAuthors(ZipOutputStream zos) throws IOException {
		List<Author> authors = toList(authorRepository.findAll());
		log.debug("Writing {} authors to backup", authors.size());
		addJsonToZip("authors", authors, zos);
	}

	private void addPublishers(ZipOutputStream zos) throws IOException {
		List<Publisher> publishers = toList(publisherRepository.findAll());
		log.debug("Writing {} publishers to backup", publishers.size());
		addJsonToZip("publishers", publishers, zos);
	}

	private void addJsonToZip(String name, Object value, ZipOutputStream zos) throws IOException {
		ZipEntry zipEntry = new ZipEntry(name + ".json");
		zos.putNextEntry(zipEntry);
		mapper.writeValue(zos, value);
		zos.closeEntry();
	}

	private <T> List<T> toList(Iterable<T> iterable) {
		return Observable.from(iterable).toList().toBlocking().single();
	}

}
