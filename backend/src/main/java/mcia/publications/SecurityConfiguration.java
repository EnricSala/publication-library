package mcia.publications;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
			.authorizeRequests()
				.antMatchers(HttpMethod.GET, "/", "/index.html").permitAll()
				.antMatchers(HttpMethod.GET, "/*.js", "/*.css").permitAll()
				.antMatchers(HttpMethod.GET, "/api/**").permitAll()
				.antMatchers(HttpMethod.GET, "/js/**", "/css/**").permitAll()
				.antMatchers(HttpMethod.GET, "/img/**", "/view/**").permitAll()
				.antMatchers(HttpMethod.GET, "/photos/**").permitAll()
				.anyRequest().authenticated()
				.and()
			.formLogin()
				.permitAll()
				.and()
			.httpBasic()
				.authenticationEntryPoint(new NoHeaderAuthenticationEntryPoint())
				.and()
			.csrf()
				.disable();
	}

	private static class NoHeaderAuthenticationEntryPoint implements AuthenticationEntryPoint {

		@Override
		public void commence(HttpServletRequest request, HttpServletResponse response,
							 AuthenticationException authException) throws IOException, ServletException {
			// Not sending the WWW-Authenticate header to prevent the
			// browser from showing a basic authentication popup
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
		}

	}

}
