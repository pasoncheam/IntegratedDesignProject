#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// ====== CONFIGURE THESE ======
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

// Firebase Realtime Database REST endpoint (make sure to include ".json")
// Example: "https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app/sensors/latest.json?auth=YOUR_DB_SECRET"
const char* FIREBASE_ENDPOINT = "https://YOUR_DATABASE_URL/sensors/latest.json?auth=YOUR_DB_SECRET";
// ======================================

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected. IP: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  connectWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  // Read a voltage from A0 as test for water level (0..1V on ESP8266 ADC)
  int raw = analogRead(A0);
  // Convert ADC (0..1023) to volts (assuming 1.0V reference or proper divider)
  float voltage = (raw / 1023.0) * 1.0; 

  // Dummy values for rainfall/humidity for now; replace with your sensors later
  float rainfallMm = 0.0; 
  float humidityPct = 50.0; 

  unsigned long ts = millis() / 1000; // seconds since boot; replace with RTC if needed

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClientSecure client;
    client.setInsecure(); // For simplicity; for production, load root CA

    http.begin(client, FIREBASE_ENDPOINT);
    http.addHeader("Content-Type", "application/json");

    String payload = String("{") +
                     "\"waterLevelVoltage\":" + String(voltage, 3) + "," +
                     "\"rainfallMm\":" + String(rainfallMm, 2) + "," +
                     "\"humidityPct\":" + String(humidityPct, 1) + "," +
                     "\"timestamp\":" + String(ts) +
                     "}";

    int code = http.PUT(payload); // PUT writes/overwrites /sensors/latest
    if (code > 0) {
      Serial.printf("Firebase response: %d\n", code);
      String resp = http.getString();
      Serial.println(resp);
    } else {
      Serial.printf("HTTP error: %s\n", http.errorToString(code).c_str());
    }
    http.end();
  }

  delay(15000); // send every 15 seconds
}


