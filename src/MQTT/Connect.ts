import mqtt from "mqtt";
class MqttHandler {
  mqttClient: any;
  host: string;
  clientId: string;
  username: string;
  password: string;
  port:number
  constructor() {
    this.mqttClient = null;
    this.host = "mqtt://mqtt3.thingspeak.com";
    this.username = "ETIHAAIXAxgoOg8rJyMQKCo";
    this.password = "O3Faxu1BijtXvoLZDyEuPz4K";
    this.clientId = "ETIHAAIXAxgoOg8rJyMQKCo";
    this.port = 1883;
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
        clientId: this.clientId,
        username: this.username,
        password: this.password,
        port: this.port,
        clean:true,
    });

    this.mqttClient.on("error", (err: any) => {
      console.log(err);
      this.mqttClient.end();
    });

    this.mqttClient.on("connect", () => {
      console.log(`mqtt client connected`);
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }
  sendMessage(topic:string,message: string) {
    this.mqttClient.publish(topic, message);
  }
}

export default MqttHandler;