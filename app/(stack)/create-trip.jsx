import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { db } from '../../config/firebase';
import Colors from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateTripScreen = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amountPerSeat, setAmountPerSeat] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const companyId = await AsyncStorage.getItem('companyId');
        if (!companyId) return;

        const q = query(collection(db, 'buses'), where('companyId', '==', companyId));
        const snapshot = await getDocs(q);
        const busList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBuses(busList);
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };

    fetchBuses();
  }, []);

  const clearInputs = () => {
    setFrom('');
    setTo('');
    setAmountPerSeat('');
    setDate(new Date());
    setTime(new Date());
    setSelectedBus(null);
  };

  const handleSubmit = async () => {
    if (!from || !to || !amountPerSeat || !selectedBus) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }

    try {
      setisLoading(true);

      const companyId = await AsyncStorage.getItem('companyId');
      const userId = await AsyncStorage.getItem('userId');
      const companyName = await AsyncStorage.getItem('companyName');

      if (!userId || !companyId || !companyName) throw new Error('Missing user or company info.');

      await addDoc(collection(db, 'trips'), {
        from,
        to,
        amountPerSeat: parseInt(amountPerSeat, 10),
        date: date.toISOString().split('T')[0],
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        companyId,
        companyName,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        occupiedSeats: [],
        busId: selectedBus.id,
        registration: selectedBus.registration,
        seatCapacity: selectedBus.seatCapacity,
      });

      setMessageType('success');
      setMessage('Trip created successfully');
      clearInputs();
    } catch (error) {
      console.error(error);
      setMessageType('error');
      setMessage(`Error: ${error.message}`);
    } finally {
      setisLoading(false);
    }
  };

  const filteredBuses = buses.filter((bus) =>
    bus.registration?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingViewContainer}>
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.label}>From (Boarding Point)</Text>
            <TextInput
              style={styles.input}
              placeholder="Kampala"
              value={from}
              onChangeText={setFrom}
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.label}>To (Destination)</Text>
            <TextInput
              style={styles.input}
              placeholder="Lira"
              value={to}
              onChangeText={setTo}
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.label}>Select Bus</Text>
            <Pressable style={styles.input} onPress={() => setModalVisible(true)}>
              <Text style={{ color: selectedBus ? Colors.text : Colors.textMuted }}>
                {selectedBus ? `${selectedBus.registration}` : 'Tap to select a bus'}
              </Text>
            </Pressable>

            <Text style={styles.label}>Amount per Seat (UGX)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 25000"
              value={amountPerSeat}
              onChangeText={setAmountPerSeat}
              keyboardType="numeric"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.label}>Trip Date</Text>
            <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateTimePlaceholder}>{date.toDateString()}</Text>
            </Pressable>

            <Text style={styles.label}>Departure Time</Text>
            <Pressable style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateTimePlaceholder}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setTime(selectedTime);
                }}
              />
            )}

            {message && (
              <Text
                style={[
                  styles.feedback,
                  messageType === 'success' ? styles.success : styles.error,
                ]}>
                {message}
              </Text>
            )}

            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Trip...' : 'Create Trip'}
              </Text>
            </Pressable>
          </View>

          <Modal visible={modalVisible} animationType="fade" transparent>
            <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
              <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select a Bus</Text>
                  <Pressable onPress={() => setModalVisible(false)} style={styles.modalHeaderClose}>
                    <Text style={styles.modalHeaderCloseText}>✕</Text>
                  </Pressable>
                </View>

                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by registration or model"
                  placeholderTextColor={Colors.textMuted}
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />

                {filteredBuses.length === 0 ? (
                  <Text style={styles.emptyText}>No buses match your search</Text>
                ) : (
                  <FlatList
                    data={filteredBuses}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item }) => {
                      const isSelected = selectedBus?.id === item.id;
                      return (
                        <Pressable
                          style={[styles.modalItem, isSelected && styles.selectedItem]}
                          onPress={() => {
                            setSelectedBus(item);
                            setModalVisible(false);
                          }}>
                          <Text style={[styles.busText, isSelected && styles.selectedBusText]}>
                            {item.registration} {item.model ? `(${item.model})` : ''}
                          </Text>
                          <Text style={styles.modalSub}>Seats: {item.seatCapacity}</Text>
                        </Pressable>
                      );
                    }}
                  />
                )}
              </Pressable>
            </Pressable>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingViewContainer: { flex: 1, backgroundColor: Colors.surface },
  container: { flex: 1, padding: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6, color: Colors.textMuted },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateTimePlaceholder: { color: Colors.textMuted },
  feedback: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  success: {
    backgroundColor: Colors.successBackground,
    color: Colors.success,
  },
  error: {
    backgroundColor: Colors.errorBackground,
    color: Colors.error,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
  },
  buttonText: {
    color: Colors.textInverse,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.text,
    textAlign: 'center',
  },

  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  selectedItem: {
    backgroundColor: Colors.primaryLight,
  },

  busText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },

  selectedBusText: {
    color: Colors.primary,
  },

  modalSub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },

  modalClose: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: Colors.border,
  },

  modalCloseText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },

  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 6,
  },

  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  modalHeaderClose: {
    padding: 4,
  },

  modalHeaderCloseText: {
    fontSize: 22,
    color: Colors.textMuted,
  },

  searchInput: {
    backgroundColor: Colors.inputBackground || '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
  },
});

export default CreateTripScreen;
