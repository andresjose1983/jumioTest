import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, NativeModules, NativeEventEmitter } from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const { JumioMobileSDK } = NativeModules;

export const URL = "http://api-dev.liftcommerce.com/";
const headers = {
  "Content-Type": "application/json",
  "API-KEY": "5dbb36169aa4ad00019f74972a304fa29e124044b9702478b24cd3d1",
  tenantName: "FUNDZ",
  DEVICE_OS: "Android",
  DEVICE_ID: "",
  TIMEZONE: "America/Caracas",
  IP_ADDRESS: "",
};


export default function App() {

  const [jumioInfo, setJumioInfo] = useState()

  useEffect(() => {
    (async () => {
      
      //login
      var details = {
          'username': "andres+dt22@trofiventures.com",
          'password': "111111a",
          'grant_type': 'password'
      };
      var formBody = [];
      for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      const response = await fetch(URL + "auth/oauth/token", {
        method: "POST",
        headers: Object.assign({}, headers, {
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        body: formBody,
      }).then(response => response.json())
      //get kyc token
      const response2 = await fetch(URL + "kyc-ms/getToken", {
        method: "GET",
        headers: Object.assign({}, headers, {Authorization: "Bearer " + response.access_token}),
      }).then(response => response.json());
      console.log(response2)

      JumioMobileSDK.initialize(response2.token, "US");
      JumioMobileSDK.start();

      const emitterJumio = new NativeEventEmitter(JumioMobileSDK);
      emitterJumio.addListener(
          'EventResult',
          (EventResult) => setJumioInfo(JSON.stringify(EventResult))
      );
      emitterJumio.addListener(
          'EventError',
          (EventError) => console.log("EventError: " + JSON.stringify(EventError))
      );

      return () => {
        emitterJumio?.removeAllListeners("EventResult");
        emitterJumio?.removeAllListeners("EventError");
      };

    })()
  }, [])
  return (
    <View style={styles.container}>
      <Text style={{marginHorizontal:16}}>{jumioInfo}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
