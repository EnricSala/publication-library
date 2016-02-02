package mcia.publications;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import lombok.extern.slf4j.Slf4j;
import mcia.publications.rx.RxObservableReturnValueHandler;

@Configuration
@Slf4j
public class MvcConfiguration extends WebMvcConfigurerAdapter {

	@Value("${photos.dir}")
	private String photosDir = "";

	@Override
	public void addReturnValueHandlers(List<HandlerMethodReturnValueHandler> returnValueHandlers) {
		returnValueHandlers.add(new RxObservableReturnValueHandler());
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		if (!photosDir.isEmpty()) {
			Assert.isTrue(new File(photosDir).isDirectory(), "Cannot find directory photos.dir=" + photosDir);

			// The path must end with a separator, so make sure
			String path = photosDir.endsWith(File.separator) ? photosDir : photosDir + File.separator;

			log.warn("Mapping {} to /photos/**", path);
			registry
				.addResourceHandler("/photos/**")
				.addResourceLocations("file:" + path)
				.setCachePeriod(24 * 60 * 60);
		}
	}

}
