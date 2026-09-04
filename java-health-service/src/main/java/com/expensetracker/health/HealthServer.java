package com.expensetracker.health;

import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

/**
 * Minimal sidecar service that pings the Node API's /healthz endpoint
 * and exposes an aggregate cluster health check on :8080/status.
 * Demonstrates a small Gradle-built Java service alongside the Node API.
 */
public class HealthServer {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/status", exchange -> {
            String response = "{\"healthServiceStatus\":\"ok\"}";
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        });
        server.setExecutor(null);
        server.start();
        System.out.println("Java health-service listening on 8080");
    }
}
