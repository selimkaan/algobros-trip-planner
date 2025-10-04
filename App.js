import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import LandingScreen from './screens/LandingScreen';
import ChatScreen from './screens/ChatScreen';
import TripDetailScreen from './screens/TripDetailScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import MyTravelsScreen from './screens/MyTravelsScreen';
import NewTripDetailScreen from './screens/NewTripDetailScreen';
import MyTripsScreen from './screens/MyTripsScreen';
import ReservationConfirmationScreen from './screens/ReservationConfirmationScreen';

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
        <Stack.Screen name="TripDetail" component={NewTripDetailScreen} />
        <Stack.Screen name="OldTripDetail" component={TripDetailScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name="ReservationConfirmation" component={ReservationConfirmationScreen} />
        <Stack.Screen name="MyTravels" component={MyTripsScreen} />
        <Stack.Screen name="MyTrips" component={MyTripsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
