import React, { useState } from 'react';
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
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { db } from '../../config/firebase';
import Colors from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateTripScreen = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [busReg, setBusReg] = useState('');
  const [amountPerSeat, setAmountPerSeat] = useState('');
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
    setAmountPerSeat('');
    setDate(new Date());
    setTime(new Date());
  };

  const handleSubmit = async () => {
    if (!from || !to || !busReg || !amountPerSeat) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }

    try {
      setisLoading(true);

      const companyId = await AsyncStorage.getItem('companyId');
      const userId = await AsyncStorage.getItem('userId');
      const companyName = await AsyncStorage.getItem('companyName');

      if (userId !== null && companyId !== null && companyName !== null) {
        await addDoc(collection(db, 'trips'), {
          from,
          to,
          busRegistration: busReg,
          amountPerSeat: parseInt(amountPerSeat, 10),
          date: date.toISOString().split('T')[0],
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          companyId: companyId,
          companyName: companyName,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          occupiedSeats: [],
        });

        setMessageType('success');
        setMessage('Trip created successfully');
        clearInputs();
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`Error: ${error.message}`);
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingViewContainer}
      testID="create-trip-screen">
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
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
                onChangeText={setTo}
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
              <Text style={styles.label}>Amount per Seat (UGX)</Text>
              <TextInput
                testID="amount-per-seat"
                style={styles.input}
                placeholder="e.g. 25000"
                value={amountPerSeat}
                onChangeText={setAmountPerSeat}
                keyboardType="numeric"
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingViewContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
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

export default CreateTripScreen;
