# ESP32 IoT Node Firmware

Firmware for ESP32 microcontrollers to collect and transmit rainfall and water level data to the USTP Flood Digital Twin backend.

## Hardware Requirements

- ESP32 microcontroller (ESP32-WROOM-32 or similar)
- Rainfall sensor (tipping bucket rain gauge)
- Water level sensor (ultrasonic or float sensor)
- Power supply (5V with backup battery recommended)
- WiFi antenna (if using module without built-in)

## Software Requirements

- PlatformIO IDE or Arduino IDE
- ESP32 board support package
- Required libraries (see `platformio.ini` or `lib_deps`)

## Configuration

Edit `config.h` to set:
- WiFi credentials
- Backend API URL
- Node ID and location
- Sensor pin assignments
- Update intervals

## Building and Flashing

### Using PlatformIO
```bash
cd firmware
pio run
pio run --target upload
```

### Using Arduino IDE
1. Open `firmware/src/main.cpp` in Arduino IDE
2. Select ESP32 board in Tools > Board
3. Select correct port in Tools > Port
4. Click Upload button

## Simulation Mode

Set `SIMULATION_MODE` to `true` in `config.h` to test without hardware. This generates mock sensor data.

## Features

- WiFi connection with auto-reconnect
- HTTP API communication with backend
- Sensor data collection (rainfall, water level)
- Configurable update intervals
- Error handling and retry logic
- Watchdog timer for reliability
- OTA updates support (future)

## Data Format

Sends POST requests to `/api/nodes/{id}/status` with:
```json
{
  "status": "Active",
  "timestamp": "ISO-8601 timestamp"
}
```

Rainfall data sent to backend endpoint (to be implemented):
```json
{
  "intensity_mmhr": 0.0,
  "timestamp": "ISO-8601 timestamp",
  "is_synced": true
}
```

## Troubleshooting

- Monitor serial output at 115200 baud
- Check WiFi credentials in config
- Verify backend API is accessible
- Ensure sensor pins are correctly configured
