package org.example.habitforgeclient.api;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.example.habitforgeclient.util.UserSession;

public class HabitApiClient {
    private final HttpClient client = HttpClient.newHttpClient();
    private final String BASE_URL = "http://localhost:8080/api/habits";

    public String getMyHabits() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BASE_URL))
                    .header("Authorization", "Bearer " + UserSession.getToken())
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (Exception e) { e.printStackTrace(); }
        return null;
    }

    public void completeHabit(Long habitId) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BASE_URL + "/" + habitId + "/complete"))
                    .header("Authorization", "Bearer " + UserSession.getToken())
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();

            client.send(request, HttpResponse.BodyHandlers.discarding());
        } catch (Exception e) { e.printStackTrace(); }
    }
}