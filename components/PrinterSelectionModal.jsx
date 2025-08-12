import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DeviceSelectionModal({
  visible,
  onClose,
  devices,
  onPrinterSelect,
  loading = false,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* Backdrop */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Prevent propagation of backdrop press to modal content */}
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select a Device</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color="#333" />
            </Pressable>
          </View>

          {/* Loading state */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4B5EFF" />
              <Text style={styles.loadingText}>Scanning for devices...</Text>
            </View>
          ) : (
            <FlatList
              data={devices}
              keyExtractor={(item) => item.inner_mac_address}
              contentContainerStyle={{ paddingBottom: 16 }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              ListEmptyComponent={<Text style={styles.emptyText}>No devices found.</Text>}
              renderItem={({ item }) => (
                <Pressable onPress={() => onPrinterSelect(item)} style={styles.deviceItem}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="bluetooth" size={24} color="#4B5EFF" />
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{item.device_name || 'Unknown Device'}</Text>
                    <Text style={styles.deviceMac}>{item.inner_mac_address}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 36,
    height: 36,
    backgroundColor: '#eee',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 40,
    color: '#888',
    fontSize: 14,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E5E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  deviceMac: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});
