import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { StatusBar } from 'expo-status-bar';
import { format } from 'date-fns';

export default function VerifyTicket() {
  const { tripId, bookingId } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!tripId || !bookingId) return;

      try {
        const tripRef = doc(db, 'trips', tripId);
        const tripSnap = await getDoc(tripRef);

        if (tripSnap.exists()) {
          setTrip({ id: tripSnap.id, ...tripSnap.data() });

          const bookingRef = doc(db, 'trips', tripId, 'bookings', bookingId);
          const bookingSnap = await getDoc(bookingRef);

          if (bookingSnap.exists()) {
            setBooking({ id: bookingSnap.id, ...bookingSnap.data() });
          }
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, bookingId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e88e5" />
        <Text style={styles.loadingText}>Loading ticket...</Text>
      </View>
    );
  }

  if (!trip || !booking) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Ticket not found or invalid</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Trip Details</Text>
        <View style={styles.cardItem}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{trip.from}</Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{trip.to}</Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.label}>Bus:</Text>
          <Text style={styles.value}>
            {trip.busId} ({trip.type})
          </Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.label}>Company:</Text>
          <Text style={styles.value}>{trip.companyName}</Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.label}>Start Time:</Text>
          <Text style={styles.value}>
            {format(trip.startDateTime.toDate(), 'eeee dd LLL yyyy')}{' '}
            {format(trip.startDateTime.toDate(), 'hh:mm a')}
          </Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.label}>Seat Capacity:</Text>
          <Text style={styles.value}>{trip.seatCapacity}</Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.label}>Fare per Seat:</Text>
          <Text style={styles.value}>UGX {Number(trip.amountPerSeat).toLocaleString('en-US')}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Booking Details</Text>
        <View style={styles.cardItem}>
          <Text style={styles.label}>Passenger:</Text>
          <Text style={styles.value}>{booking.passengerDetails?.fullName}</Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{booking.passengerDetails?.phone}</Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.label}>Booked Seats:</Text>
          <Text style={styles.value}>{booking.selectedSeats.join(', ')}</Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.label}>Total Paid:</Text>
          <Text style={styles.value}>UGX {Number(booking.totalPrice).toLocaleString('en-US')}</Text>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.label}>Booked At:</Text>
          <Text style={styles.value}>
            {format(booking.bookedAt?.toDate(), 'eee dd LLL yyyy')}{' '}
            {format(booking.bookedAt?.toDate(), 'hh:mm a')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 5,
  },
  cardItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    width: 130,
    fontWeight: '500',
    color: '#333',
  },
  value: {
    flex: 1,
    color: '#555',
  },
  error: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '600',
  },
});
