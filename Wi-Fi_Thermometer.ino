#include <ESP8266WiFi.h>                                                // Библиотека для создания Wi-Fi подключения (клиент или точка доступа)
#include <ESP8266WebServer.h>                                           // Библиотека для управления устройством по HTTP (например из браузера)
#include <FS.h>                                                         // Библиотека для работы с файловой системой
#include <ESP8266FtpServer.h>                                           // Библиотека для работы с SPIFFS по FTP
#include <WiFiClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "secrets.h"
#include <FastBot.h>

#define RELAY LED_BUILTIN                                               // Встроенный светодиоддиод
#define TEMP_REFRESH_PERIOD 10
#define GRAPH_WRITE_DIVIDER 6 
#define GRAPH_LEN 1440 
#define ONE_WIRE_BUS 13

FastBot bot(SECRET_TOKEN);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
ESP8266WebServer HTTP(80);                                              // Определяем объект и порт сервера для работы с HTTP
FtpServer ftpSrv;                                                       // Определяем объект для работы с модулем по FTP (для отладки HTML)

int alarmTempHi = 27;
int alarmTempLow = 22;
bool alarmOn = true;
bool alarmReseted = false;
bool alarmFirst = true;
int graphData[GRAPH_LEN];
uint16_t graphPointer;
uint16_t sendPointer;  
unsigned long timing;
float temperatureC;
byte graphWriteDivider;

void setup() {
  pinMode(RELAY, OUTPUT);                                                // Определяем пин реле как исходящий
  Serial.begin(9600);    
  WiFi.mode(WIFI_STA);
  WiFi.begin(SECRET_SSID, SECRET_PASS);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(SECRET_SSID);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());                                       // Инициализируем вывод данных на серийный порт со скоростью 9600 бод
  SPIFFS.begin();                                                       // Инициализируем работу с файловой системой                          
  HTTP.begin();                                                         // Инициализируем Web-сервер
  ftpSrv.begin("relay","relay");                                        // Поднимаем FTP-сервер для удобства отладки работы HTML (логин: relay, пароль: relay)
  sensors.begin();
  bot.attach(newMsg);

  // HTTP.on("/relay_switch", [](){                                        // При HTTP запросе вида http://192.168.4.1/relay_switch
  //     HTTP.send(200, "text/plain", relay_switch());                     // Отдаём клиенту код успешной обработки запроса, сообщаем, что формат ответа текстовый и возвращаем результат выполнения функции relay_switch 
  //   });


  // HTTP.on("/relay_status", [](){                                        // При HTTP запросе вида http://192.168.4.1/relay_status
  //     HTTP.send(200, "text/plain", relay_status());                     // Отдаём клиенту код успешной обработки запроса, сообщаем, что формат ответа текстовый и возвращаем результат выполнения функции relay_status 
  //   });

  HTTP.on("/temperature", [](){                                         // При HTTP запросе вида http://192.168.4.1/temperature
      HTTP.send(200, "text/plain", String(temperatureC));               // Отдаём клиенту код успешной обработки запроса, сообщаем, что формат ответа текстовый и возвращаем температуру
    });

  HTTP.on("/graph", [](){                                               // При HTTP запросе вида http://192.168.4.1/graph
      HTTP.send(200, "text/plain", sendGraph());                        // Отдаём клиенту код успешной обработки запроса, сообщаем, что формат ответа текстовый и возвращаем массив с графиком
    });

  HTTP.onNotFound([](){                                                 // Описываем действия при событии "Не найдено"
  if(!handleFileRead(HTTP.uri()))                                       // Если функция handleFileRead (описана ниже) возвращает значение false в ответ на поиск файла в файловой системе
      HTTP.send(404, "text/plain", "Not Found");                        // возвращаем на запрос текстовое сообщение "File isn't found" с кодом 404 (не найдено)
  });
}

void loop() {
    // digitalWrite(RELAY, 1);
    HTTP.handleClient();                                                // Обработчик HTTP-событий (отлавливает HTTP-запросы к устройству и обрабатывает их в соответствии с выше описанным алгоритмом)
    ftpSrv.handleFTP();                                                 // Обработчик FTP-соединений  
    tempCheck(TEMP_REFRESH_PERIOD);
    // digitalWrite(RELAY, 0);
    bot.tick();
  }

  void telegramAlarm() {
  if (temperatureC >= alarmTempHi && alarmOn && !alarmReseted)          // Если температура выше нормы, уведомления включены и не были сброшены
  {
    if (alarmFirst)
    {
      alarmFirst = false;
    }else{
      bot.deleteMessage(bot.lastBotMsg(), SECRET_MYID);
    }
    bot.sendMessage("Внимание! Температура превысила норму: " + String(temperatureC) + "°C", SECRET_MYID);
  }else if (temperatureC <= alarmTempLow && alarmOn && !alarmReseted)   // Если ниже выше нормы, уведомления включены и не были сброшены
  {
    if (alarmFirst)
    {
      alarmFirst = false;
    }else{
      bot.deleteMessage(bot.lastBotMsg(), SECRET_MYID);
    }
    bot.sendMessage("Внимание! Температура ниже нормы: " + String(temperatureC) + "°C", SECRET_MYID);
  }else if (temperatureC < alarmTempHi && alarmReseted && temperatureC > alarmTempLow && alarmReseted)
  {                                                                     // Приостановка уведомлений
    bot.sendMessage("Температура в норме", SECRET_MYID);
    alarmReseted = false;
  }
}

void newMsg(FB_msg& msg) {
  // выводим всю информацию о сообщении
  // Serial.println(msg.toString());
  // if (msg.OTA && msg.text == "update14473") {
  bot.setTextMode(FB_TEXT);
  String command = msg.text;
  command.toLowerCase();
  if (msg.OTA) {
    bot.update();
  }else if (command.substring(0, 5) == "spirt") {
    uint8_t a = command.substring(6, 8).toInt();
    uint8_t b = command.substring(9, 11).toInt();
    float result = a + (20 - b) * 0.3;
    bot.sendMessage("содержание спирта: " + String(result) + " %об.", msg.chatID);
  }else if (command == "id")
  {
    bot.sendMessage(msg.chatID, msg.chatID);
  }else if (command == "alarm status")
  {
    if (alarmOn)
    {
      bot.sendMessage("Уведомление включено, установлена температура: "  + String(alarmTempLow) + "-" + String(alarmTempHi) + "°C", msg.chatID);
    }else {
      bot.sendMessage("Уведомление отключено", msg.chatID);
    }
  }else if (command.substring(0, 9) == "alarm set")
  {
    alarmOn = true;
    alarmReseted = false;
    alarmTempLow = msg.text.substring(10, 12).toInt();  //alarm set 22 27
    alarmTempHi = msg.text.substring(13, 15).toInt();
    bot.sendMessage("Уведомление включено, установлена температура: "  + String(alarmTempLow) + "-" + String(alarmTempHi) + "°C", msg.chatID);
  }else if (command == "alarm off")
  {
    alarmOn = false;
    bot.sendMessage("Уведомление отключено", msg.chatID);
  }else if (command == "alarm on")
  {
    alarmOn = true;
    alarmReseted = false;
    bot.sendMessage("Уведомление включено, установлена температура: "  + String(alarmTempLow) + "-" + String(alarmTempHi) + "°C", msg.chatID);
  }else if (command == "help" || command == "/help")
  {
    bot.setTextMode(FB_MARKDOWN);
    bot.sendMessage(F( "Список команд:\n`t`, `temp` - Возвращает температуру на датчике\n`alarm status` - Статус уведомлений\n`alarm on` - Включает уведомление по превышению температуры\n`alarm off` - Отключает уведомление по превышению температуры\n`alarm set` - Задает температуру в формате `alarm set XX XX`\n`id` - Узнать ID чата"), msg.chatID);
  }else if (command == "t" || command == "temp")
  {
    bot.sendMessage("Температура на датчике: " + String(temperatureC) + "°C", msg.chatID);
  }else if (command == "ok")
  {
    alarmReseted = true;
    bot.sendMessage("Уведомление приостановлено", msg.chatID);
  }else {
    bot.sendMessage("Неизвестная команда. Пиши `help` для справки", msg.chatID);
  }  
}

void tempCheck(unsigned int t) {
  digitalWrite(RELAY, 0);
  if (millis() - timing > t * 1000){                                     // Проверяем миллис на прошедшее время
    timing = millis();                                                   // Обновляем время прошлого срабатывания
    timing = timing - (timing % 10);                                     // Округляем тайминг для большей точности
    sensors.requestTemperatures();                                       // Запрашиваем вычисление температуры
    temperatureC = sensors.getTempCByIndex(0);                           // Получаем значение температуры в переменную
    if (graphWriteDivider < GRAPH_WRITE_DIVIDER - 1)
    {
      graphWriteDivider++;
    }else{
      writeGraph();
      graphWriteDivider = 0;
      telegramAlarm();
    }
  }
  digitalWrite(RELAY, 1);
}

String sendGraph() {
  String str;
  for (int i = 0; i < sendPointer; ++i)
  {
    str += graphData[i];
    if (i < sendPointer - 1)
    {
      str += ",";
    }
  }
  return str + "," + 
  graphPointer + "," + 
  TEMP_REFRESH_PERIOD + "," + 
  GRAPH_WRITE_DIVIDER;
}

void writeGraph() {
  if (graphPointer < GRAPH_LEN - 1)
  {
    graphData[graphPointer] = int(temperatureC*10);
    graphPointer++;
    if (sendPointer < GRAPH_LEN)
    {
      sendPointer++;
    }
  }else{
    graphData[graphPointer] = int(temperatureC*10);
    graphPointer = 0;
  }
}

bool handleFileRead(String path){                                       // Функция работы с файловой системой
  if(path.endsWith("/")) path += "index.html";                          // Если устройство вызывается по корневому адресу, то должен вызываться файл index.html (добавляем его в конец адреса)
  String contentType = getContentType(path);                            // С помощью функции getContentType (описана ниже) определяем по типу файла (в адресе обращения) какой заголовок необходимо возвращать по его вызову
  if(SPIFFS.exists(path)){                                              // Если в файловой системе существует файл по адресу обращения
    File file = SPIFFS.open(path, "r");                                 //  Открываем файл для чтения
    size_t sent = HTTP.streamFile(file, contentType);                   //  Выводим содержимое файла по HTTP, указывая заголовок типа содержимого contentType
    file.close();                                                       //  Закрываем файл
    return true;                                                        //  Завершаем выполнение функции, возвращая результатом ее исполнения true (истина)
  }
  return false;                                                         // Завершаем выполнение функции, возвращая результатом ее исполнения false (если не обработалось предыдущее условие)
}

String getContentType(String filename){                                 // Функция, возвращающая необходимый заголовок типа содержимого в зависимости от расширения файла
  if (filename.endsWith(".html")) return "text/html";                   // Если файл заканчивается на ".html", то возвращаем заголовок "text/html" и завершаем выполнение функции
  else if (filename.endsWith(".css")) return "text/css";                // Если файл заканчивается на ".css", то возвращаем заголовок "text/css" и завершаем выполнение функции
  else if (filename.endsWith(".js")) return "application/javascript";   // Если файл заканчивается на ".js", то возвращаем заголовок "application/javascript" и завершаем выполнение функции
  else if (filename.endsWith(".png")) return "image/png";               // Если файл заканчивается на ".png", то возвращаем заголовок "image/png" и завершаем выполнение функции
  else if (filename.endsWith(".jpg")) return "image/jpeg";              // Если файл заканчивается на ".jpg", то возвращаем заголовок "image/jpg" и завершаем выполнение функции
  else if (filename.endsWith(".gif")) return "image/gif";               // Если файл заканчивается на ".gif", то возвращаем заголовок "image/gif" и завершаем выполнение функции
  else if (filename.endsWith(".ico")) return "image/x-icon";            // Если файл заканчивается на ".ico", то возвращаем заголовок "image/x-icon" и завершаем выполнение функции
  else if (filename.endsWith(".svg")) return "image/svg+xml";
  return "text/plain";                                                  // Если ни один из типов файла не совпал, то считаем что содержимое файла текстовое, отдаем соответствующий заголовок и завершаем выполнение функции
}
