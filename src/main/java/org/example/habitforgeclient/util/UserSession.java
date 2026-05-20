package org.example.habitforgeclient.util;

public class UserSession {
    private static String token;

    public static void setToken(String token) { UserSession.token = token; }
    public static String getToken() { return token; }
}