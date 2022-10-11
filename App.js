import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, NativeModules, NativeEventEmitter, Linking, SafeAreaView, Alert } from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const { JumioMobileSDK } = NativeModules;
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';

export const URL = "https://api.cloudpayments.com/";
const headers = {
  "Content-Type": "application/json",
  "API-KEY": "5cc31beb901a2e00017617f8af9a9076ba7541969a5dfb79b17248d1",
  tenantName: "CANNACARD",
  DEVICE_OS: "ANDROID",
  DEVICE_ID: "",
  TIMEZONE: "America/Caracas",
  IP_ADDRESS: "",
};


export default function App() {

  const [jumioInfo, setJumioInfo] = useState()
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    (async () => {
      
      //login
      var details = {
          'username': "blake@tigrepay.com",
          'password': "X332332x",
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

      console.log(`https://api.cloudpayments-staging.com/test-ribbit-widget/index2.html?token=${response.access_token}&tenantName=CANNACARD`)
     // let result = await WebBrowser.openBrowserAsync(`https://api.cloudpayments-staging.com/test-ribbit-widget/index2.html?token=${response.access_token}&tenantName=CANNACARD`);
     // setResult(result);
      //get kyc token
      
      /*const response2 = await fetch(URL + "kyc-ms/getToken", {
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
      };*/

    })()
  }, [])
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 24 }}>
      {result === undefined && <WebView originWhitelist={['*']} 
        source={{ uri: `https://api.cloudpayments-staging.com/test-ribbit-widget/index2.html?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfbmFtZSI6bnVsbCwidGVuYW50X25hbWUiOiJDQU5OQUNBUkQiLCJ1c2VyX3R5cGUiOiJTVUJTQ1JJQkVSIiwidXNlcl9uYW1lIjoiYmxha2VAdGlncmVwYXkuY29tIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sImxhc3Rfc2lnbm9uX3RpbWVzdGFtcCI6MTY2NTQ5Mjk1ODA0MywiZXhwIjoxNjY1NDk2NTU4LCJ1dWlkIjoiNjM4ZDY1YjQtMzBlMy00NjA1LTg4MzAtNDVkMTM4OTk0ZjA0IiwiYXV0aG9yaXRpZXMiOlsiQ09OU1VNRVIiXSwianRpIjoiNzFmNDU3YjktOThmMi00NGIzLWEzM2UtN2NmYzJlNDhlMDdiIiwiY2xpZW50X2lkIjoiQ0FOTkFDQVJEIn0.pnJIHHeWyLSL5XbnwzjZ_N-dZwgRxEhTF0SJRyPR2R3BvWyK_FrhRbpzxH6JoUdv1t_U1LlMwDiUvCt33Re4oWE0cA5ksoOA5vLOtsu4C1J6c_pGIrSXeD9qI547AMjHELB_hbaOEFkvgByLDN5HP66kAVzjVVwNtn9S0es2qJUo6DjHihhsBgE5XL7oFlFKLUKcjPXAPj2RaZvR7slPbjygprNMhztI2t3S1lzVAsKhTzJtI3LAyhDNpzotUMbmf3eGW6SIjTK38yl6jDInpjcQu3s4SExoCZJESAgWdBFXIJjiKGyPiqWJAXYDVdmS6x4czH2lTkLdyvPnNKx5Nw&tenantName=CANNACARD` }} 
        javaScriptCanOpenWindowsAutomatically={true} 
        javaScriptEnabled={true}
        onMessage={(event)=> {
          console.log(JSON.parse(event.nativeEvent.data).type)
          if(JSON.parse(event.nativeEvent.data).type === "ENROLLMENT_SUCCESS")
            Alert.alert("Data",event.nativeEvent.data)
        }}
      />
}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
