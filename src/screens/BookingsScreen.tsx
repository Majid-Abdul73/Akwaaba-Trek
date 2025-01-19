import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Booking } from '../types';

const db = SQLite.openDatabaseSync('akwaaba.db');

const BookingsScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const result = await db.getFirstAsync<Booking>('SELECT * FROM bookings ORDER BY date DESC');
      setBookings(result ? [result] : []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingTitle}>Booking #{item.id}</Text>
      <Text style={styles.bookingDate}>
        Date: {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.bookingStatus}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2D5A27',
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bookingDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  bookingStatus: {
    fontSize: 16,
    color: '#2D5A27',
    fontWeight: '500',
  },
});

export default BookingsScreen;