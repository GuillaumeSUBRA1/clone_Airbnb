package com.example.back.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import java.util.HashSet;
import java.util.Set;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName(null);
        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "tenant/get-all-by-category").permitAll()
                        .requestMatchers(HttpMethod.GET, "tenant/get-one").permitAll()
                        .requestMatchers(HttpMethod.POST, "tenant/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "booking/check-available").permitAll()
                        .requestMatchers(HttpMethod.GET, "assets/*").permitAll()
                        .anyRequest().authenticated())
                .csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(requestHandler))
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .oauth2Login(withDefaults())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()))
                .oauth2Client(withDefaults());
        return http.build();
    }

    @Bean
    public GrantedAuthoritiesMapper userAuthoritiesMapper() {
        return authorities -> {
            Set<GrantedAuthority> grantedAuthorities = new HashSet<>();

            authorities.forEach(grantedAuthority -> {
                if (grantedAuthority instanceof OidcUserAuthority oidcUserAuthority) {
                    grantedAuthorities.addAll(SecurityUtils.authFromClaim(oidcUserAuthority.getUserInfo().getClaims()));
                }
            });
            return grantedAuthorities;
        };
    }
}
