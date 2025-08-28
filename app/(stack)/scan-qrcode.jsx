import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AppState, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [torchOn, setTorchOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // toggle facing to force CameraView refresh:
        setFacing((f) => (f === 'back' ? 'front' : 'back'));
        setTimeout(() => {
          setFacing((f) => (f === 'back' ? 'front' : 'back'));
        }, 100);
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  function toggleTorch() {
    setTorchOn((prev) => !prev);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <CameraView
        style={styles.camera}
        facing={facing}
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={({ data }) => {
          Linking.openURL(data);
        }}
      />

      {/* Overlay buttons container */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={toggleTorch}>
          <Text style={styles.text}>{torchOn ? 'Turn Off Torch' : 'Turn On Torch'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
