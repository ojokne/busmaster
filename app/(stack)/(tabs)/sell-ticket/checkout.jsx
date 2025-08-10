import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useState } from 'react';
import Colors from '../../../../constants/colors';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../config/firebase';

export default function CheckoutScreen() {
  const { seats, from, to, amountPerSeat, tripId } = useLocalSearchParams();
  const parsedSeats = seats ? JSON.parse(seats) : [];
  const pricePerSeat = amountPerSeat ? parseFloat(amountPerSeat) : 0;
  const totalPrice = parsedSeats.length * pricePerSeat;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleConfirm = async () => {
    if (!fullName || !phone) {
      alert('Please enter your name and phone number');
      return;
    }

    setLoading(true);
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to confirm a booking.');
      setLoading(false);
      return;
    }

    try {
      const tripRef = doc(db, 'trips', tripId);

      // Add booking document to bookings subcollection
      const bookingsCol = collection(tripRef, 'bookings');
      await addDoc(bookingsCol, {
        userId: user.uid,
        selectedSeats: parsedSeats,
        passengerDetails: {
          fullName,
          phone,
        },
        totalPrice,
        bookedAt: new Date(),
      });

      // Update occupiedSeats array on trip document
      await updateDoc(tripRef, {
        occupiedSeats: arrayUnion(...parsedSeats),
      });
      setLoading(false);
      router.replace('sell-ticket');
    } catch (error) {
      console.error('Error confirming booking:', error);
      setLoading(false);
      alert('Failed to confirm booking. Please try again.');
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Pressable onPress={Keyboard.dismiss}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Passenger Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor={Colors.textMuted}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor={Colors.textMuted}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>

          {/* From & To */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>{from}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>To</Text>
            <Text style={styles.value}>{to}</Text>
          </View>

          {/* Selected Seats */}
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Selected Seats</Text>
          <View style={styles.seatList}>
            {parsedSeats.length > 0 ? (
              parsedSeats.map((seat, index) => (
                <View key={index} style={styles.seatTag}>
                  <Text style={styles.seatText}>{seat}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No seats selected</Text>
            )}
          </View>

          {/* Pricing */}
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Pricing</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              UGX {pricePerSeat.toLocaleString()} × {parsedSeats.length}
            </Text>
            <Text style={styles.value}>UGX {totalPrice.toLocaleString()}</Text>
          </View>
        </View>

        <Pressable
          style={[styles.confirmButton, (!fullName || !phone) && { opacity: 0.6 }]}
          onPress={handleConfirm}
          disabled={!fullName || !phone || loading}>
          <Text style={styles.confirmText}>{loading ? 'Processing' : 'Confirm Booking'}</Text>
        </Pressable>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  seatList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  seatTag: {
    backgroundColor: Colors.selectedSeat,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  seatText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 14,
    backgroundColor: Colors.surface,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
