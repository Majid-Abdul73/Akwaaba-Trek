import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { initPayment } from '../services/payment';
import { Destination } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const db = SQLite.openDatabaseSync('akwaaba.db');

type RouteParams = {
  destination: Destination;
}

type RootStackParamList = {
  Bookings: undefined;
  DestinationDetails: { destination: Destination };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DestinationDetailsScreen = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation<NavigationProp>();
  const { destination } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  const handleBookTour = async () => {
    try {
      const paymentResult = await initPayment({
        amount: destination.tourPrice,
        description: `Tour booking for ${destination.name}`,
        currency: 'GHS'
      });

      if (paymentResult.success) {
        // Save booking to local database
        db.execAsync(
          `INSERT INTO bookings (destinationId, date, status) VALUES ('${destination.id}', '${new Date().toISOString()}', 'confirmed')`
        ).then(() => {
          navigation.navigate('Bookings');
        }).catch((error) => {
          console.error('Error saving booking:', error);
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const toggleSaveOffline = async () => {
    try {
      if (!isSaved) {
        await db.execAsync(
          `INSERT INTO saved_destinations (id, data) VALUES ('${destination.id}', '${JSON.stringify(destination)}')`
        );
        setIsSaved(true);
      } else {
        await db.execAsync(
          `DELETE FROM saved_destinations WHERE id = '${destination.id}'`
        );
        setIsSaved(false);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: destination.imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{destination.name}</Text>
          <TouchableOpacity onPress={toggleSaveOffline}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color="#2D5A27"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.location}>{destination.location}</Text>
        <Text style={styles.description}>{destination.description}</Text>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: destination.coordinates.latitude,
              longitude: destination.coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: destination.coordinates.latitude,
                longitude: destination.coordinates.longitude,
              }}
              title={destination.name}
            />
          </MapView>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBookTour}>
          <Text style={styles.bookButtonText}>Book Tour - GHS {destination.tourPrice}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  mapContainer: {
    height: 200,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  bookButton: {
    backgroundColor: '#2D5A27',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DestinationDetailsScreen;