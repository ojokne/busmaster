import { View, StyleSheet } from 'react-native';
import Seat from './Seat';

const ExecutiveBusLayout = ({ selectedSeats, occupiedSeats, onSeatPress }) => {
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

  // First 13 rows (1–52)
  for (let i = 1; i <= 52; i += 4) {
    seats.push(
      <View style={styles.row} key={i}>
        {/* Left side */}
        <View style={styles.seatPair}>
          {renderSeat(i)}
          {renderSeat(i + 1)}
        </View>

        {/* Aisle */}
        <View style={styles.aisle} />

        {/* Right side */}
        <View style={styles.seatPair}>
          {renderSeat(i + 2)}
          {renderSeat(i + 3)}
        </View>
      </View>,
    );
  }

  // Last row (53 - 57)
  seats.push(
    <View style={styles.row} key="last-row">
      {/* Left pair */}
      <View style={styles.seatPair}>
        {renderSeat(53)}
        {renderSeat(54)}
      </View>

      {/* Center seat */}
      <View style={styles.singleSeatCenter}>{renderSeat(55)}</View>

      {/* Right pair */}
      <View style={styles.seatPair}>
        {renderSeat(56)}
        {renderSeat(57)}
      </View>
    </View>,
  );

  return <>{seats}</>;
};

const styles = StyleSheet.create({
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
  singleSeatCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExecutiveBusLayout;
