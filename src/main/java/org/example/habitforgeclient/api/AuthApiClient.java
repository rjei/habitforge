package org.example.habitforgeclient.api;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.example.habitforgeclient.util.UserSession;

public class AuthApiClient {
    private final HttpClient client = HttpClient.newHttpClient();
    private final String BASE_URL = "http://localhost:8080/api/auth";

    public boolean login(String username, String password) {
        try {
            String json = String.format("{\"username\":\"%s\", \"password\":\"%s\"}", username, password);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BASE_URL + "/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Sederhananya, kita ekstrak token dari JSON manual atau pakai Jackson/Gson
                // Contoh format: {"token": "ey...", "tokenType": "Bearer", ...}
                String token = response.body().split("\"token\":\"")[1].split("\"")[0];
                UserSession.setToken(token);
                return true;
            }
        } catch (Exception e) { e.printStackTrace(); }
        return false;
    }
}