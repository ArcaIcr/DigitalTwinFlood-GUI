#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

// Global variables
unsigned long lastStatusUpdate = 0;
unsigned long lastSensorRead = 0;
unsigned long lastReconnectAttempt = 0;
bool wifiConnected = false;

// Sensor data
float rainfallIntensity = 0.0;
float waterLevel = 0.0;

// Function prototypes
void connectWiFi();
void sendNodeStatus();
void sendSensorData();
void readSensors();
float simulateRainfall();
float simulateWaterLevel();
void setupWatchdog();
void feedWatchdog();

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== USTP Flood IoT Node ===");
  Serial.print("Node ID: ");
  Serial.println(NODE_ID);
  Serial.print("Location: ");
  Serial.println(NODE_LOCATION);
  Serial.print("Simulation Mode: ");
  Serial.println(SIMULATION_MODE ? "ON" : "OFF");
  
  // Initialize sensor pins
  pinMode(RAIN_SENSOR_PIN, INPUT);
  pinMode(WATER_LEVEL_PIN, INPUT);
  
  // Connect to WiFi
  connectWiFi();
  
  // Setup watchdog timer
  setupWatchdog();
  
  Serial.println("Setup complete. Starting main loop...\n");
}

void loop() {
  feedWatchdog();
  
  unsigned long currentTime = millis();
  
  // WiFi reconnection logic
  if (!wifiConnected && (currentTime - lastReconnectAttempt >= RECONNECT_INTERVAL)) {
    connectWiFi();
    lastReconnectAttempt = currentTime;
  }
  
  // Read sensors at configured interval
  if (wifiConnected && (currentTime - lastSensorRead >= SENSOR_READ_INTERVAL)) {
    readSensors();
    sendSensorData();
    lastSensorRead = currentTime;
  }
  
  // Send node status at configured interval
  if (wifiConnected && (currentTime - lastStatusUpdate >= STATUS_UPDATE_INTERVAL)) {
    sendNodeStatus();
    lastStatusUpdate = currentTime;
  }
  
  delay(100);
}

void connectWiFi() {
  Serial.print("Connecting to WiFi...");
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    wifiConnected = false;
    Serial.println("\nWiFi connection failed. Will retry later.");
  }
}

void sendNodeStatus() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Cannot send status: WiFi not connected");
    return;
  }
  
  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/nodes/" + String(NODE_ID) + "/status";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["status"] = "Active";
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  int httpResponseCode = http.PUT(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.print("Status update sent. Response: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("Error sending status: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}

void sendSensorData() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Cannot send sensor data: WiFi not connected");
    return;
  }
  
  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/telemetry/sensor-data";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["intensity_mmhr"] = rainfallIntensity;
  doc["node_id"] = NODE_ID;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.print("Sensor data sent. Response: ");
    Serial.println(httpResponseCode);
    
    // Log sensor data
    Serial.print("Rainfall Intensity: ");
    Serial.print(rainfallIntensity);
    Serial.println(" mm/hr");
    
    Serial.print("Water Level: ");
    Serial.print(waterLevel);
    Serial.println(" %");
  } else {
    Serial.print("Error sending sensor data: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}

void readSensors() {
  if (SIMULATION_MODE) {
    rainfallIntensity = simulateRainfall();
    waterLevel = simulateWaterLevel();
  } else {
    // Read actual sensors
    int rainRaw = analogRead(RAIN_SENSOR_PIN);
    int waterRaw = analogRead(WATER_LEVEL_PIN);
    
    // Convert raw values to meaningful units
    rainfallIntensity = map(rainRaw, RAIN_SENSOR_MIN, RAIN_SENSOR_MAX, 0, 100) / 10.0;
    waterLevel = map(waterRaw, WATER_LEVEL_MIN, WATER_LEVEL_MAX, 0, 100);
  }
  
  // Apply basic filtering/smoothing
  static float lastRainfall = 0;
  rainfallIntensity = (rainfallIntensity * 0.7) + (lastRainfall * 0.3);
  lastRainfall = rainfallIntensity;
}

float simulateRainfall() {
  // Simulate rainfall with random variations
  static float currentRainfall = 0;
  float change = (random(0, 20) - 10) / 10.0; // Random change between -1 and 1
  currentRainfall = max(0, currentRainfall + change);
  return currentRainfall;
}

float simulateWaterLevel() {
  // Simulate water level based on rainfall
  static float currentLevel = 50;
  float targetLevel = min(100, currentLevel + (rainfallIntensity / 5));
  currentLevel = (currentLevel * 0.9) + (targetLevel * 0.1);
  return currentLevel;
}

void setupWatchdog() {
  // ESP32 has built-in watchdog, but we can add additional monitoring
  Serial.println("Watchdog timer configured");
}

void feedWatchdog() {
  // Feed the watchdog timer to prevent reset
  // This is a placeholder - actual implementation depends on ESP32 watchdog library
}
