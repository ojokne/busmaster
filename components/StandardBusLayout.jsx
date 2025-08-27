import { View, StyleSheet, Text } from 'react-native';
import Seat from './Seat';

const StandardBusLayout = ({ selectedSeats, occupiedSeats, onSeatPress }) => {
  const renderSeat = (i) => (
    <Seat
      key={i}
      number={i}
      currentStatus={
        occupiedSeats.includes(i)
          ? 'occupied'
          : selectedSeats.includes(i)
            ? 'selected'
            : 'available'
      }
      onPress={() => onSeatPress(i)}
    />
  );

  const seats = [];
  let seatNumber = 1;

  // Row 1: 2 seats on left, driver cabin on right
  seats.push(
    <View style={styles.row} key="row-1">
      <View style={styles.leftSide}>
        {renderSeat(seatNumber++)}
        {renderSeat(seatNumber++)}
      </View>
      <View style={styles.aisle} />
      <View style={styles.driverCabin}>
        <Text style={styles.cabinText}>Driver</Text>
      </View>
    </View>,
  );

  // Middle rows (rows 2–12): 2 seats left, 3 seats right
  for (let i = 0; i < 11; i++) {
    seats.push(
      <View style={styles.row} key={`row-${i + 2}`}>
        <View style={styles.leftSide}>
          {renderSeat(seatNumber++)}
          {renderSeat(seatNumber++)}
        </View>
        <View style={styles.aisle} />
        <View style={styles.rightSide}>
          {renderSeat(seatNumber++)}
          {renderSeat(seatNumber++)}
          {renderSeat(seatNumber++)}
        </View>
      </View>,
    );
  }

  // Last row: 6 seats (no aisle)
  seats.push(
    <View style={[styles.row, { justifyContent: 'center' }]} key="last-row">
      {[...Array(6)].map((_, idx) => renderSeat(seatNumber++))}
    </View>,
  );

  return <>{seats}</>;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  leftSide: {
    flexDirection: 'row',
  },
  rightSide: {
    flexDirection: 'row',
  },
  aisle: {
    width: 20,
  },
  driverCabin: {
    width: 60,
    height: 40,
    backgroundColor: '#D1D5DB',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cabinText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: 'bold',
  },
});

export default StandardBusLayout;
