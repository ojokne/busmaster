import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../config/firebase';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function BusLayoutScreen() {
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
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
      <Text>
        {trip.from} → {trip.to}
      </Text>
      <Text>
        {trip.date} at {trip.time}
      </Text>
      {/* You can now render your seat layout here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
});
