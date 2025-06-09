import App from 'expo-router/entry';
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';

if (!__DEV__) {
  console.log = () => {};
}

AppRegistry.registerComponent('app', () => App);
