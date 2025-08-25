import { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather, FontAwesome5, FontAwesome, AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import Colors from '../../../constants/colors';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const HomeScreen = () => {
  const [showRevenue, setShowRevenue] = useState(false);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [dailyTicketsSold, setDailyTicketsSold] = useState(0);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  const router = useRouter();

  const handleCreateTrip = () => {
    router.push('/create-trip');
  };

  const handleSellTicket = () => {
    router.push('/sell-ticket');
  };

  useFocusEffect(
    useCallback(() => {
      const fetchTrips = async () => {
        try {
          setLoadingTrips(true);

          const companyId = await AsyncStorage.getItem('companyId');

          if (companyId !== null) {
            const tripsRef = collection(db, 'trips');
            const q = query(
              tripsRef,
              where('companyId', '==', companyId),
              where('startDateTime', '>', Timestamp.now()),
              orderBy('startDateTime', 'asc'),
              limit(3),
            );

            const querySnapshot = await getDocs(q);

            const trips = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setRecentTrips(trips);
          }
        } catch (error) {
          console.error('Error fetching trips:', error);
        } finally {
          setLoadingTrips(false);
        }
      };

      fetchTrips();

      return () => {
        setLoadingTrips(true);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const fetchTodayStats = async () => {
        try {
          const companyId = await AsyncStorage.getItem('companyId');
          const userId = await AsyncStorage.getItem('userId');

          if (userId !== null && companyId !== null) {
            const tripsRef = collection(db, 'trips');
            const q = query(tripsRef, where('companyId', '==', companyId));
            const tripsSnapshot = await getDocs(q);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let totalRevenue = 0;
            let totalTickets = 0;

            for (const tripDoc of tripsSnapshot.docs) {
              const bookingsRef = collection(db, 'trips', tripDoc.id, 'bookings');
              const bookingsSnapshot = await getDocs(bookingsRef);

              bookingsSnapshot.forEach((bookingDoc) => {
                const data = bookingDoc.data();

                const bookingDate = data.bookedAt?.toDate();

                const isToday = bookingDate && bookingDate.toDateString() === today.toDateString();
                const createdByUser = userId === data.createdBy;

                if (isToday && createdByUser) {
                  totalRevenue += data.totalPrice || 0;
                  totalTickets += data.selectedSeats?.length || 0;
                }
              });
            }

            setDailyRevenue(totalRevenue);
            setDailyTicketsSold(totalTickets);
          }
        } catch (error) {
          console.error("Error fetching today's bookings:", error);
        }
      };

      fetchTodayStats();

      return () => {};
    }, []),
  );
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
              {showRevenue ? `UGX ${dailyRevenue.toLocaleString()}` : '••••••'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle} testID="tickets-sold-card-title">
              Tickets Sold
            </Text>
            <Text style={styles.amount} testID="total-tickets-sold">
              {dailyTicketsSold}
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
          <View>
            {loadingTrips ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <View>
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
                          <AntDesign name="calendar" />{' '}
                          {format(trip.startDateTime.toDate(), 'yyyy-MM-dd')}
                        </Text>
                        <Text style={styles.tripDate}>
                          <AntDesign name="clockcircleo" />{' '}
                          {format(trip.startDateTime.toDate(), 'hh:mm a')}
                        </Text>
                      </View>
                      <View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.tickets}>Seats booked:</Text>
                          <Text style={styles.ticketSold}>{trip.occupiedSeats?.length || 0}</Text>
                        </View>
                        <Text style={styles.tripDate}>
                          UGX {Number(trip.amountPerSeat).toLocaleString('en-us')}
                        </Text>
                        <Text style={styles.tripDate}>{trip.registration}</Text>
                      </View>
                    </Pressable>
                  ))
                )}
              </View>
            )}
          </View>
        </View>
      </View>
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
    color: Colors.textMuted,
  },
  ticketSold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textMuted,
    paddingStart: 4,
  },
});

export default HomeScreen;
