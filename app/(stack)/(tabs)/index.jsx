// import { View, Text, Button } from 'react-native';
// import { signOut } from 'firebase/auth';
// import { auth } from '@/config/firebase';
// import { useRouter } from 'expo-router';

// const Home = () => {
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.replace('/signin'); // or '/' if that's your login route
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Home</Text>
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// };

// export default Home;

import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../../constants/colors';
import CreateTripModal from '../../../components/CreateTripModal';

const HomeScreen = () => {
  const [showRevenue, setShowRevenue] = useState(false);
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const companyId = 'example-company-id';

  const revenue = 154000;
  const ticketsSold = 327;

  const recentTickets = [
    { id: '1', passenger: 'John Doe', amount: 1500, date: '2025-08-01' },
    { id: '2', passenger: 'Jane Smith', amount: 2300, date: '2025-08-01' },
    { id: '3', passenger: 'Sam Brown', amount: 1800, date: '2025-07-31' },
    { id: '4', passenger: 'Tina Grey', amount: 1900, date: '2025-07-30' },
    { id: '5', passenger: 'Alex N.', amount: 2100, date: '2025-07-29' },
  ];

  const limitedTickets = recentTickets.slice(0, 3);

  const handleCreateTrip = () => {
    setShowModal(true);
  };

  const handleSellTicket = () => {
    router.push('/sell-ticket');
  };

  const handleViewAllTickets = () => {
    router.push('/tickets');
  };

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
              <Pressable onPress={() => setShowRevenue((prev) => !prev)} testID="toggleRevenue">
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
          <Pressable style={styles.actionCard} onPress={handleSellTicket}>
            <FontAwesome5 name="bus" size={24} color={Colors.primary} />
            <Text style={styles.actionText} testID="sell-ticket">
              Sell Ticket
            </Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={handleCreateTrip}>
            <FontAwesome name="road" size={28} color={Colors.primary} />
            <Text style={styles.actionText} testID="create-trip">
              Create Trip
            </Text>
          </Pressable>
        </View>

        <View style={styles.ticketsHeader}>
          <Text style={styles.sectionTitle} testID="recent-tickets">
            Recent Tickets
          </Text>
          <Pressable onPress={handleViewAllTickets}>
            <Text style={styles.seeAllText} testID="all-tickets">
              See All
            </Text>
          </Pressable>
        </View>

        {limitedTickets.map((item) => (
          <View key={item.id} style={styles.ticketItem}>
            <View>
              <Text style={styles.ticketName}>{item.passenger}</Text>
              <Text style={styles.ticketDate}>{item.date}</Text>
            </View>
            <Text style={styles.ticketAmount}>UGX {item.amount.toLocaleString()}</Text>
          </View>
        ))}
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
  ticketItem: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  ticketDate: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  ticketAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
});

export default HomeScreen;
