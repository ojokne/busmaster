import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather, FontAwesome5, FontAwesome, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../../constants/colors';
import CreateTripModal from '../../../components/CreateTripModal';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const HomeScreen = () => {
  const [showRevenue, setShowRevenue] = useState(false);
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const companyId = 'example-company-id';

  const revenue = 154000;
  const ticketsSold = 327;

  const [recentTrips, setRecentTrips] = useState([]);
  const handleCreateTrip = () => {
    router.push('/create-trip');
  };

  const handleSellTicket = () => {
    router.push('/sell-ticket');
  };

  useEffect(() => {
    const tripsRef = collection(db, 'trips');
    const q = query(tripsRef, orderBy('date', 'desc'), limit(3));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const trips = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentTrips(trips);
      },
      (error) => {
        console.error('Failed to fetch recent trips:', error);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} testID="homescreen-header">
          Bus Master
        </Text>

        <View style={styles.summaryContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} testID="revenue-card-title">
                Total Revenue
              </Text>
              <Pressable onPress={() => setShowRevenue((prev) => !prev)} testID="toggle-revenue">
                <Feather name={showRevenue ? 'eye-off' : 'eye'} size={20} color="#555" />
              </Pressable>
            </View>
            <Text style={styles.amount} testID="total-revenue">
              {showRevenue ? `UGX ${revenue.toLocaleString()}` : '••••••'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle} testID="tickets-sold-card-title">
              Tickets Sold
            </Text>
            <Text style={styles.amount} testID="total-tickets-sold">
              {ticketsSold}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.sectionTitle} testID="quick-actions-title">
          Quick Actions
        </Text>
        <View style={styles.actionsContainer}>
          <Pressable style={styles.actionCard} onPress={handleSellTicket} testID="sell-ticket">
            <FontAwesome5 name="bus" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Sell Ticket</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={handleCreateTrip} testID="create-trip">
            <FontAwesome name="road" size={28} color={Colors.primary} />
            <Text style={styles.actionText}>Create Trip</Text>
          </Pressable>
        </View>

        <View>
          <Text style={styles.sectionTitle} testID="recent-trips">
            Recent Trips
          </Text>
          {recentTrips.length === 0 ? (
            <Text style={{ textAlign: 'center' }}>No recent trips.</Text>
          ) : (
            recentTrips.map((trip) => (
              <Pressable
                key={trip.id}
                style={styles.tripItem}
                onPress={() => router.push(`sell-ticket/bus-layout/${trip.id}`)}>
                <View>
                  <Text style={styles.tripName}>
                    {trip.from} <AntDesign name="arrowright" /> {trip.to}
                  </Text>
                  <Text style={styles.tripDate}>
                    <AntDesign name="calendar" /> {trip.date} <AntDesign name="clockcircleo" />{' '}
                    {trip.time}
                  </Text>
                </View>
                <View>
                  <Text style={styles.tickets}>
                    Seats booked: {trip.occupiedSeats?.length || 0}
                  </Text>
                  <Text style={styles.tripDate}>
                    UGX {Number(trip.amountPerSeat).toLocaleString('en-us')}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </View>
      <CreateTripModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        companyId={companyId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.textInverse,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  card: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 16,
    marginRight: 12,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: '600',
    paddingRight: 6,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.textMuted,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  actionCard: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 12,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  ticketsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seeAllText: {
    color: Colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  tripItem: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tripName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tripDate: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  tickets: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
});

export default HomeScreen;
