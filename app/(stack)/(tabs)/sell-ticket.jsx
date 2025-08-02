import { View, Text, StyleSheet } from 'react-native';

export default function SellTicketsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sell ticket</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
