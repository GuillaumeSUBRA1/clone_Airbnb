package com.example.back.infrastructure.config;

import com.example.back.entity.AuthorityEntity;
import com.example.back.entity.UserEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class SecurityUtils {

    public static final String ROLE_TENANT = "ROLE_TENANT";
    public static final String ROLE_LANDLORD = "ROLE_LANDLORD";
    public static final String CLAIMS_NAMESPACE = "https://www.clone-airbnb.fr/roles";

    public static UserEntity mapAuth2ToUser(Map<String, Object> attr) {
        UserEntity user = new UserEntity();
        String sub = String.valueOf(attr.get("sub"));
        String username = null;
        if (attr.get("preferred_username") != null) {
            username = ((String) attr.get("preferred_username")).toLowerCase();
        }
        if (attr.get("given_name") != null) {
            user.setFirstName(((String) attr.get("given_name")));
        } else if (attr.get("nickname") != null) {
            user.setFirstName(((String) attr.get("nickname")));
        }

        if (attr.get("email") != null) {
            user.setEmail((String) attr.get("email"));
        } else if (sub.contains("|") && (username != null && username.contains("@"))) {
            user.setEmail(username);
        } else {
            user.setEmail(sub);
        }

        if (attr.get("family_name") != null) {
            user.setLastName(((String) attr.get("family_name")));
        }

        if (attr.get("picture") != null) {
            user.setImage(((String) attr.get("picture")));
        }

        if (attr.get(CLAIMS_NAMESPACE) != null) {
            List<String> authoritiesRaw = (List<String>) attr.get(CLAIMS_NAMESPACE);
            Set<AuthorityEntity> authorities = authoritiesRaw.stream()
                    .map(a -> {
                        AuthorityEntity auth = new AuthorityEntity();
                        auth.setName(a);
                        return auth;
                    }).collect(Collectors.toSet());
            user.setAuthorities(authorities);
        }
        return user;
    }

    public static List<SimpleGrantedAuthority> authFromClaim(Map<String, Object> claims) {
        return mapRoles(getRolesFromClaims(claims));
    }

    private static Collection<String> getRolesFromClaims(Map<String, Object> claims) {
        return (List<String>) claims.get(CLAIMS_NAMESPACE);
    }

    private static List<SimpleGrantedAuthority> mapRoles(Collection<String> roles) {
        return roles.stream().filter(role -> role.startsWith("ROLE_")).map(SimpleGrantedAuthority::new).toList();
    }

    public static boolean hasCurrentUserAnyAuthority(String... auth) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && getAuthorities(authentication).anyMatch(a -> Arrays.asList(auth).contains(a));
    }

    private static Stream<String> getAuthorities(Authentication authentication) {
        Collection<? extends GrantedAuthority> authorities =
                authentication instanceof JwtAuthenticationToken jwtAuthenticationToken ?
                        authFromClaim(jwtAuthenticationToken.getToken().getClaims()) : authentication.getAuthorities();
        return authorities.stream().map(GrantedAuthority::getAuthority);
    }
}
