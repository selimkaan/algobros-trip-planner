import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import LandingScreen from './screens/LandingScreen';
import ChatScreen from './screens/ChatScreen';
import TripDetailScreen from './screens/TripDetailScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import MyTravelsScreen from './screens/MyTravelsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="TripDetail" component={TripDetailScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name="MyTravels" component={MyTravelsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
