// import { Pressable, Text, StyleSheet } from 'react-native';
// import Colors from '../constants/colors';

// const Seat = ({ number, currentStatus, onSelect }) => {
//   return (
//     <Pressable
//       style={[
//         styles.seat,
//         currentStatus === 'available' && styles.available,
//         currentStatus === 'selected' && styles.selected,
//         currentStatus === 'occupied' && styles.occupied,
//       ]}
//       onPress={onSelect}
//       disabled={currentStatus === 'occupied'}>
//       <Text
//         style={[
//           styles.seatText,
//           currentStatus === 'selected' && styles.selectedText,
//           currentStatus === 'occupied' && styles.occupiedText,
//         ]}>
//         {number}
//       </Text>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   seat: {
//     width: 40,
//     height: 40,
//     margin: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   available: {
//     backgroundColor: Colors.availableSeat,
//   },
//   selected: {
//     backgroundColor: Colors.selectedSeat,
//   },
//   occupied: {
//     backgroundColor: Colors.occupiedSeat,
//     color: Colors.white,
//   },

//   selectedText: {
//     color: Colors.white,
//   },
//   occupiedText: {
//     color: Colors.white,
//   },
//   seatText: {
//     fontWeight: 'bold',
//   },
// });

// export default Seat;

// Seat.js
import { Pressable, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

const Seat = ({ number, currentStatus, onPress }) => {
  return (
    <Pressable
      style={[
        styles.seat,
        currentStatus === 'available' && styles.available,
        currentStatus === 'selected' && styles.selected,
        currentStatus === 'occupied' && styles.occupied,
      ]}
      onPress={() => onPress(number, currentStatus)}>
      <Text
        style={[
          styles.seatText,
          currentStatus === 'selected' && styles.selectedText,
          currentStatus === 'occupied' && styles.occupiedText,
        ]}>
        {number}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  seat: {
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  available: {
    backgroundColor: Colors.availableSeat,
  },
  selected: {
    backgroundColor: Colors.selectedSeat,
  },
  occupied: {
    backgroundColor: Colors.occupiedSeat,
  },
  selectedText: {
    color: Colors.white,
  },
  occupiedText: {
    color: Colors.white,
  },
  seatText: {
    fontWeight: 'bold',
  },
});

export default Seat;
