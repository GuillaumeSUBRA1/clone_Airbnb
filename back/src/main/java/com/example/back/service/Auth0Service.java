package com.example.back.service;

import com.auth0.client.auth.AuthAPI;
import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.client.mgmt.filter.FieldsFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.auth.TokenHolder;
import com.auth0.json.mgmt.users.User;
import com.auth0.net.Response;
import com.auth0.net.TokenRequest;
import com.example.back.infrastructure.config.SecurityUtils;
import com.example.back.record.record_dto.UserDTO;
import com.example.back.utils.exception.UserException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class Auth0Service {
    @Value("${okta.oauth2.client-id}")
    private String clientId;
    @Value("${okta.oauth2.client-secret}")
    private String clientSecret;
    @Value("${okta.oauth2.issuer}")
    private String issuer;
    @Value("${application.auth0.role-landlord-id}")
    private String roleLanlordId;

    public void addLandlordRoleToUser(UserDTO userDTO) {
        if (userDTO.authorities().stream().noneMatch(role -> role.equals(SecurityUtils.ROLE_LANDLORD))) {
            try {
                assignRoleById(getAccessToken(), userDTO.email(), userDTO.pid(), roleLanlordId);
            } catch (Auth0Exception e) {
                throw new UserException(String.format("Can't assign %s to %s", roleLanlordId, userDTO.pid()));
            }
        }
    }

    private void assignRoleById(String accessToken, String email, UUID pid, String roleIdToAdd) throws Auth0Exception {
        ManagementAPI m = ManagementAPI.newBuilder(issuer, accessToken).build();
        Response<List<User>> auth0UsersByEmail = m.users().listByEmail(email, new FieldsFilter()).execute();
        User user = auth0UsersByEmail.getBody().stream().findFirst().orElseThrow(() -> new UserException(String.format("No user found for pid %s", pid)));
        m.roles().assignUsers(roleIdToAdd, List.of(user.getId())).execute();
    }

    private String getAccessToken() throws Auth0Exception {
        AuthAPI authAPI = AuthAPI.newBuilder(issuer, clientId, clientSecret).build();
        TokenRequest tokenRequest = authAPI.requestToken(issuer + "api/v2/");
        TokenHolder holder = tokenRequest.execute().getBody();
        return holder.getAccessToken();
    }
}
