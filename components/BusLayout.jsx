import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import Seat from './Seat';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const BusLayout = ({ totalSeats, from, to, tripId }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [passengerInfo, setPassengerInfo] = useState(null);

  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const toggleSeat = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) {
      handleOccupiedSeatPress(seatNumber);
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber],
    );
  };

  const handleOccupiedSeatPress = (seatNumber) => {
    const match = allBookings.find((booking) => booking.selectedSeats?.includes(seatNumber));

    if (match) {
      setPassengerInfo({
        seat: seatNumber,
        ...match.passengerDetails,
      });
      setModalVisible(true);
    } else {
      alert('No passenger info found for this seat.');
    }
  };

  const handleNext = () => {
    router.push({
      pathname: 'sell-ticket/checkout',
      params: {
        seats: JSON.stringify(selectedSeats),
        from,
        to,
        seatPrice: 40000,
        tripId,
      },
    });
    console.log(selectedSeats);
  };

  const render52Seats = () => {
    const seats = [];

    for (let i = 1; i <= 52; i += 4) {
      seats.push(
        <View style={styles.row} key={i}>
          <View style={styles.seatPair}>
            <Seat
              number={i}
              currentStatus={
                occupiedSeats.includes(i)
                  ? 'occupied'
                  : selectedSeats.includes(i)
                    ? 'selected'
                    : 'available'
              }
              onPress={() => toggleSeat(i)}
            />
            <Seat
              number={i + 1}
              currentStatus={
                occupiedSeats.includes(i + 1)
                  ? 'occupied'
                  : selectedSeats.includes(i + 1)
                    ? 'selected'
                    : 'available'
              }
              onPress={() => toggleSeat(i + 1)}
            />
          </View>
          <View style={styles.seatPair}>
            <Seat
              number={i + 2}
              currentStatus={
                occupiedSeats.includes(i + 2)
                  ? 'occupied'
                  : selectedSeats.includes(i + 2)
                    ? 'selected'
                    : 'available'
              }
              onPress={() => toggleSeat(i + 2)}
            />
            <Seat
              number={i + 3}
              currentStatus={
                occupiedSeats.includes(i + 3)
                  ? 'occupied'
                  : selectedSeats.includes(i + 3)
                    ? 'selected'
                    : 'available'
              }
              onPress={() => toggleSeat(i + 3)}
            />
          </View>
        </View>,
      );
    }

    return seats;
  };

  useEffect(() => {
    const tripRef = doc(db, 'trips', tripId);
    const unsubscribeTrip = onSnapshot(tripRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setOccupiedSeats(data.occupiedSeats || []);
      }
    });

    return () => unsubscribeTrip();
  }, [tripId]);

  useEffect(() => {
    const bookingsRef = collection(db, 'trips', tripId, 'bookings');
    const unsubscribeBookings = onSnapshot(bookingsRef, (snapshot) => {
      const bookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllBookings(bookings);
      setLoadingBookings(false);
    });

    return () => unsubscribeBookings();
  }, [tripId]);

  if (loadingBookings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingBottom: 140, width: '100%' }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.navButton}>
          {/* <Text style={styles.navText}>Back</Text> */}
          <AntDesign name="arrowleft" size={24} />
        </Pressable>

        <Text style={styles.routeText} numberOfLines={1}>
          {from} - {to}
        </Text>

        <Pressable
          onPress={handleNext}
          disabled={selectedSeats.length === 0}
          style={[styles.navButton, selectedSeats.length === 0 && { opacity: 0.5 }]}>
          <Text style={styles.navText}>Next</Text>
        </Pressable>
      </View>
      <View style={styles.bus}>
        <ScrollView contentContainerStyle={styles.container}>{render52Seats()}</ScrollView>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.availableSeat }]} />
          <Text>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.selectedSeat }]} />
          <Text>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.occupiedSeat }]} />
          <Text>Occupied</Text>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Passenger Info</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={22} color="#6B7280" />
              </Pressable>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Seat</Text>
              <Text style={styles.detailValue}>{passengerInfo?.seat}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{passengerInfo?.fullName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{passengerInfo?.phone}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 35,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  navText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
    padding: 12,
  },
  bus: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  seatPair: {
    flexDirection: 'row',
  },
  aisle: {
    width: 20,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    height: '40%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },

  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});

export default BusLayout;
