import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { BluetoothStateManager } from 'react-native-bluetooth-state-manager';
import { BLEPrinter } from 'react-native-thermal-receipt-printer';

export const scanForDevices = async () => {
  try {
    const isReady = await checkBluetoothEnabled();
    if (!isReady) {
      return [];
    }

    initializePrinter();

    const foundDevices = await BLEPrinter.getDeviceList();
    return foundDevices;
  } catch (error) {
    console.error('Error scanning for devices:', error);
    return [];
  }
};

const initializePrinter = async () => {
  try {
    await BLEPrinter.init();
    return true;
  } catch (error) {
    console.error('Error initializing printer module:', error);
  }
};

const checkBluetoothEnabled = async () => {
  if (Platform.OS === 'android') {
    try {
      // For Android 12+ (API level 31+)
      if (Platform.Version >= 31) {
        const bluetoothScan = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: 'Bluetooth Scanning Permission',
            message: 'This app needs access to scan for nearby Bluetooth devices.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        const bluetoothConnect = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: 'Bluetooth Connection Permission',
            message: 'This app needs access to connect to Bluetooth devices.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (
          bluetoothScan !== PermissionsAndroid.RESULTS.GRANTED ||
          bluetoothConnect !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert(
            'Bluetooth Permissions Required',
            'This app needs Bluetooth permissions to connect to printers. Please enable them in your device settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          return false;
        }
      } else {
        // For older Android versions
        const location = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for Bluetooth scanning.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (location !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Location Permission Required',
            'For older Android versions, location permission is needed for Bluetooth scanning.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          return false;
        }
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  let enabled = false;
  try {
    const bluetoothStatus = await BluetoothStateManager.getState();

    if (bluetoothStatus === 'PoweredOn') {
      enabled = true;
    }
  } catch (e) {
    console.log(e);
  }

  return enabled;
};

export const enableBluetooth = async () => {
  try {
    let enabled = await checkBluetoothEnabled();
    let result = false;
    if (!enabled) {
      result = await BluetoothStateManager.requestToEnable();

      if (!result) {
        alert('Bluetooth Required', 'Please enable Bluetooth in your device settings');
      }
    } else {
      scanForDevices();
    }

    return result;
  } catch (e) {
    console.log(e);

    alert('Error', 'Bluetooth could not be enabled');
  }
};

export const connectToPrinter = async (printer) => {
  try {
    // The working code uses inner_mac_address instead of macAddress
    await BLEPrinter.connectPrinter(printer.inner_mac_address);
    Alert.alert('Printer connected successfully');
    return true;
  } catch (error) {
    console.error('Error connecting to printer:', error);
    Alert.alert('Connection Error', 'Could not connect to the selected printer');
    return false;
  }
};

export const printTicket = async ({ fullName, phone, from, to, seats, totalPrice }) => {
  try {
    const ESC = '\x1B';
    const GS = '\x1D';
    const CENTER = ESC + 'a' + '\x01';
    const LEFT = ESC + 'a' + '\x00';
    const BOLD_ON = ESC + 'E' + '\x01';
    const BOLD_OFF = ESC + 'E' + '\x00';
    const LINE = '------------------------------';

    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const seatList = seats.join(', ');
    const qrData = `Ticket: ${fullName}-${seatList}`;

    const storeLen = qrData.length + 3;
    const pL = String.fromCharCode(storeLen % 256);
    const pH = String.fromCharCode(Math.floor(storeLen / 256));

    const qrCode =
      GS +
      '(k' +
      '\x04\x00' +
      '1A' +
      '\x02\x00' + // Select model
      GS +
      '(k' +
      '\x03\x00' +
      '1C' +
      '\x08' + // Size
      GS +
      '(k' +
      '\x03\x00' +
      '1E' +
      '\x30' + // Error correction
      GS +
      '(k' +
      pL +
      pH +
      '1P0' +
      qrData + // Store data
      GS +
      '(k' +
      '\x03\x00' +
      '1Q0'; // Print QR

    const receipt =
      CENTER +
      BOLD_ON +
      'BUS MASTER RECEIPT' +
      BOLD_OFF +
      '\n' +
      CENTER +
      LINE +
      '\n' +
      LEFT +
      `Passenger: ${fullName}\n` +
      LEFT +
      `Phone: ${phone}\n` +
      LEFT +
      `From: ${from}\n` +
      LEFT +
      `To: ${to}\n` +
      LEFT +
      `Seat(s): ${seatList}\n` +
      LEFT +
      `Total: UGX ${totalPrice.toLocaleString()}\n` +
      LEFT +
      `Date: ${date} ${time}\n` +
      CENTER +
      LINE +
      '\n' +
      qrCode +
      '\n' +
      CENTER +
      'Thank you & safe travels!\n\n\n';

    await BLEPrinter.printBill(receipt);
  } catch (error) {
    console.error('Printing error:', error);
    Alert.alert('Print Error', 'Could not print the ticket.');
  }
};

export const printSingleTicket = async (fullName, phone, from, to, seat, amountPerSeat) => {
  try {
    const ESC = '\x1B';
    const GS = '\x1D';
    const CENTER = ESC + 'a' + '\x01';
    const LEFT = ESC + 'a' + '\x00';
    const BOLD_ON = ESC + 'E' + '\x01';
    const BOLD_OFF = ESC + 'E' + '\x00';
    const LINE = '------------------------------';

    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const qrData = `Ticket: ${fullName}-${seat}`;

    const storeLen = qrData.length + 3;
    const pL = String.fromCharCode(storeLen % 256);
    const pH = String.fromCharCode(Math.floor(storeLen / 256));

    const qrCode =
      GS +
      '(k' +
      '\x04\x00' +
      '1A' +
      '\x02\x00' + // Select model
      GS +
      '(k' +
      '\x03\x00' +
      '1C' +
      '\x08' + // Size
      GS +
      '(k' +
      '\x03\x00' +
      '1E' +
      '\x30' + // Error correction
      GS +
      '(k' +
      pL +
      pH +
      '1P0' +
      qrData + // Store data
      GS +
      '(k' +
      '\x03\x00' +
      '1Q0'; // Print QR

    const receipt =
      CENTER +
      BOLD_ON +
      'BUS MASTER RECEIPT' +
      BOLD_OFF +
      '\n' +
      CENTER +
      LINE +
      '\n' +
      LEFT +
      `Passenger: ${fullName}\n` +
      LEFT +
      `Phone: ${phone}\n` +
      LEFT +
      `From: ${from}\n` +
      LEFT +
      `To: ${to}\n` +
      LEFT +
      `Seat(s): ${seat}\n` +
      LEFT +
      `Total: UGX ${amountPerSeat.toLocaleString()}\n` +
      LEFT +
      `Date: ${date} ${time}\n` +
      CENTER +
      LINE +
      '\n' +
      qrCode +
      '\n' +
      CENTER +
      'Thank you & safe travels!\n\n\n';

    await BLEPrinter.printBill(receipt);
  } catch (error) {
    console.error('Printing error:', error);
    Alert.alert('Print Error', 'Could not print the ticket.');
  }
};
