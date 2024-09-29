package com.example.back.controller;

import com.example.back.record.record_dto.UserDTO;
import com.example.back.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.MessageFormat;
import java.util.Map;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/auth")
public class AuthController {

    private final ClientRegistration clientRegistration;
    @Autowired
    UserService userService;

    public AuthController(ClientRegistrationRepository registrationRepo) {
        this.clientRegistration = registrationRepo.findByRegistrationId("okta");
    }

    @GetMapping("/get_authenticated_user")
    public ResponseEntity<UserDTO> getAuthenticatedUser(
            @AuthenticationPrincipal OAuth2User user, @RequestParam("forceResync") boolean forceResync) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            userService.syncByIdp(user, forceResync);
            UserDTO connected = userService.getAuthenticatedUser();
            return new ResponseEntity<>(connected, HttpStatus.OK);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest req) {
        String issuerURI = clientRegistration.getProviderDetails().getIssuerUri();
        String originUrl = req.getHeader(HttpHeaders.ORIGIN);
        Object[] params = {issuerURI, clientRegistration.getClientId(), originUrl};
        String logout = MessageFormat.format("{0}v2/logout?client_id={1}&returnTo={2}", params);
        req.getSession().invalidate();
        return ResponseEntity.ok().body(Map.of("logout", logout));
    }
}
