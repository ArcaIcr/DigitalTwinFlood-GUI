#ifndef CONFIG_H
#define CONFIG_H

// WiFi Configuration
#define WIFI_SSID "your_wifi_ssid"
#define WIFI_PASSWORD "your_wifi_password"

// Backend Configuration
#define BACKEND_URL "http://localhost:3001"
#define NODE_ID "ESP32-01"
#define NODE_LOCATION "Main Drainage"

// Update Intervals (milliseconds)
#define STATUS_UPDATE_INTERVAL 5000    // 5 seconds
#define SENSOR_READ_INTERVAL 3000      // 3 seconds
#define RECONNECT_INTERVAL 10000       // 10 seconds

// Simulation Mode (set to true to test without hardware)
#define SIMULATION_MODE true

// Sensor Pin Assignments
#define RAIN_SENSOR_PIN 34    // Analog input for rain sensor
#define WATER_LEVEL_PIN 35    // Analog input for water level sensor

// Sensor Calibration
#define RAIN_SENSOR_MIN 0
#define RAIN_SENSOR_MAX 4095
#define WATER_LEVEL_MIN 0
#define WATER_LEVEL_MAX 4095

// Thresholds
#define RAIN_INTENSITY_THRESHOLD 50.0  // mm/hr for high alert
#define WATER_LEVEL_WARNING 80.0      // % for water level warning

// Watchdog Timer (seconds)
#define WDT_TIMEOUT 30

#endif // CONFIG_H
