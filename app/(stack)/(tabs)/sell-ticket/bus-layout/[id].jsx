import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../config/firebase';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import BusLayout from '../../../../../components/BusLayout';
import Colors from '../../../../../constants/colors';
import { StatusBar } from 'expo-status-bar';
import { connectToPrinter, scanForDevices } from '../../../../../utils';
import PrinterSelectionModal from '../../../../../components/PrinterSelectionModal';

export default function BusLayoutScreen() {
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState(null);

  useEffect(() => {
    const getTrip = async () => {
      try {
        const docRef = doc(db, 'trips', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTrip({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (e) {
        console.error('Failed to load trip:', e);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getTrip();
    }

    return () => {
      setTrip(null);
      setLoading(true);
    };
  }, [id]);

  useEffect(() => {
    const getBlueToothDevices = async () => {
      const devices = await scanForDevices();
      setDevices(devices);
    };

    getBlueToothDevices();

    if (!selectedPrinter) {
      setModalVisible(true);
    }

    return () => {
      setDevices([]);
    };
  }, [selectedPrinter]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <BusLayout
        totalSeats={53}
        bookedSeats={trip?.occupiedSeats || []}
        from={trip.from}
        to={trip.to}
        tripId={id}
        amountPerSeat={trip.amountPerSeat}
      />

      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>CHOOSE PRINTER: {selectedPrinter?.device_name}</Text>
      </Pressable>

      <PrinterSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        devices={devices}
        onPrinterSelect={async (device) => {
          const connected = connectToPrinter(device);
          if (connected) {
            setSelectedPrinter(device);
            setModalVisible(false);
          }
        }}
        loading={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
