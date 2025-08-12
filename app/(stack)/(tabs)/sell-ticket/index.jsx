import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  TextInput,
} from 'react-native';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../../../constants/colors';
import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SellTicketsScreen() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter((trip) => {
    const query = searchQuery.toLowerCase();
    return (
      trip.from.toLowerCase().includes(query) ||
      trip.to.toLowerCase().includes(query) ||
      trip.busRegistration.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchUserAndListenToTrips = async () => {
      try {
        setLoading(true);

        const companyId = await AsyncStorage.getItem('companyId');

        if (companyId !== null) {
          const tripsRef = collection(db, 'trips');
          const q = query(
            tripsRef,
            where('companyId', '==', companyId),
            orderBy('createdAt', 'desc'),
          );

          unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              const tripData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setTrips(tripData);
              setLoading(false);
            },
            (error) => {
              console.error('Error fetching trips:', error);
              setLoading(false);
            },
          );
        }
      } catch (error) {
        console.error('Error initializing trip listener:', error);
        setLoading(false);
      }
    };

    fetchUserAndListenToTrips();

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const renderTrip = ({ item }) => (
    <Pressable
      style={styles.tripItem}
      onPress={() => router.push(`/sell-ticket/bus-layout/${item.id}`)}>
      <Text style={styles.tripRoute}>
        {item.from} <AntDesign name="arrowright" /> {item.to}
      </Text>
      <Text style={styles.tripInfo}>
        <AntDesign name="calendar" /> {item.date} <Entypo name="dot-single" />{' '}
        <AntDesign name="clockcircleo" /> {item.time}
      </Text>
      <Text style={styles.tripInfo}>
        <FontAwesome5 name="bus" /> {item.busRegistration}
      </Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (trips.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No trips available</Text>
        <Pressable style={styles.backButton} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" animated />
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by route or bus"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptySearchContainer}>
            <Text style={styles.emptySearchText}>No trips match your search</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  headerContainer: {
    marginBottom: 16,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  emptySearchContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptySearchText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  tripItem: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 12,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tripInfo: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  backText: {
    fontSize: 15,
    color: Colors.primary,
  },
});
