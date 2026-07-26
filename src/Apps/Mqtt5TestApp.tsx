

import React, { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';

// hope this works. 
// I'll need pub/sub later.

export function MqttComponent() {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [status, setStatus] = useState<string>('Disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const [payload, setPayload] = useState<string>('');

  useEffect(() => {
    // WebSockets must be used in browser environments (ws:// or wss://)
    // let brokerUrl = 'ws://://hivemq.com';

    //  brokerUrl = 'ws://://707e32e549ce4da69a4a9e2d1a1f9afb.s1.eu.hivemq.cloud'
    
    // 1. Configure with your HiveMQ Cloud details
    const host = '707e32e549ce4da69a4a9e2d1a1f9afb.s1.eu.hivemq.cloud';
    const url = `wss://${host}:8884/mqtt`; // Note the wss:// and /mqtt path
    
    const options = {
      username: 'awootton', // From HiveMQ Cloud Access Management
      password: 'hveH64okUR<M',
      clientId: `react_${Math.random().toString(16).substring(2, 8)}`,
      clean: true,
      protocol: 'mqtt' as const,
      connectTimeout: 4000,
      // protocolVersion: 5, // Explicitly request MQTT 5.0 compiler REJECTS this.
      defaultProtocolVersion: 5, // Ensure default is also set to 5
    };


    // 2. Connect (was client)
    const mqttClient = mqtt.connect(url, options);


    mqttClient.on('connect', () => {
      setStatus('Connected (MQTT 5)');
      mqttClient.subscribe('react/mqtt5/topic', { qos: 0 });
      mqttClient.subscribe('test-topic', { qos: 0 });
    });

    mqttClient.on('message', (topic: string, message: Buffer) => {
      setMessages((prev) => [...prev, `${topic}: ${message.toString()}`]);
    });

    mqttClient.on('error', (err) => {
      console.error('Connection error: ', err);
      mqttClient.end();
    });

    mqttClient.on('close', () => {
      setStatus('Disconnected');
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  const handlePublish = () => {
    if (client && client.connected) {
      client.publish('react/mqtt5/topic', payload, { qos: 0 });
      setPayload('');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h3>MQTT 5.0 React TypeScript Client</h3>
      <p>Status: <b>{status}</b></p>
      
      <div>
        <input
          type="text"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={handlePublish}>Publish</button>
      </div>

      <h4>Received Messages:</h4>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
