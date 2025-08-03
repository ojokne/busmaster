import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/colors';
import { AntDesign } from '@expo/vector-icons';

const CreateTripModal = ({ visible, onClose, companyId }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [busReg, setBusReg] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const clearInputs = () => {
    setFrom('');
    setTo('');
    setBusReg('');
    setDate(new Date());
    setTime(new Date());
  };

  const handleSubmit = async () => {
    if (!from || !to || !busReg) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }

    try {
      setisLoading(true);
      await addDoc(collection(db, 'trips'), {
        from,
        to,
        busRegistration: busReg,
        date: date.toISOString().split('T')[0],
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        companyId,
        createdAt: new Date().toISOString(),
      });

      setMessageType('success');
      setMessage('Trip created successfully!');
      clearInputs();
      setisLoading(false);
    } catch (error) {
      setMessageType('error');
      setMessage(`Error: ${error.message}`);
      setisLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      testID="create-trip-modal">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingViewContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.backdrop}>
            <View style={styles.container}>
              <View style={styles.headerRow}>
                <Text style={styles.title} testID="modal-title">
                  Create Trip
                </Text>
                <Pressable onPress={onClose} testID="close-button">
                  <AntDesign name="close" size={24} color="black" />
                </Pressable>
              </View>

              <View>
                <Text style={styles.label}>From (Boarding Point)</Text>
                <TextInput
                  testID="input-from"
                  style={styles.input}
                  placeholder="Kampala"
                  value={from}
                  onChangeText={setFrom}
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View>
                <Text style={styles.label}>To (Destination)</Text>
                <TextInput
                  testID="input-to"
                  style={styles.input}
                  placeholder="Lira"
                  value={to}
                  onChange={setTo}
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View>
                <Text style={styles.label}>Bus Registration</Text>
                <TextInput
                  testID="input-bus-reg"
                  style={styles.input}
                  placeholder="UAX123X"
                  value={busReg}
                  onChangeText={setBusReg}
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View>
                <Text style={styles.label}>Trip Date</Text>
                <Pressable
                  testID="input-date"
                  style={styles.input}
                  onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateTimePlaceholder}>{date.toDateString()}</Text>
                </Pressable>
              </View>

              <View>
                <Text style={styles.label}>Departure Time</Text>
                <Pressable
                  testID="input-time"
                  style={styles.input}
                  onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.dateTimePlaceholder}>
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Pressable>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  testID="dateTime-picker-date"
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
                  testID="dateTime-picker-time"
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
                  testID="feedback-message"
                  style={[
                    styles.feedback,
                    messageType === 'success' ? styles.success : styles.error,
                  ]}>
                  {message}
                </Text>
              )}

              <Pressable style={styles.button} onPress={handleSubmit} testID="submit-button">
                <Text style={styles.buttonText}>
                  {isLoading ? 'Creating Trip...' : 'Create Trip'}
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingViewContainer: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    height: '90%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: Colors.textMuted,
  },
  dateTimePlaceholder: {
    color: Colors.textMuted,
  },
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
});

export default CreateTripModal;
