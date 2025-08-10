process.env.EXPO_OS = 'android';

// Mock AsyncStorage to avoid native module errors
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Optionally mock Firebase if needed
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));
jest.mock('firebase/auth', () => ({
  getReactNativePersistence: jest.fn(),
  initializeAuth: jest.fn(() => ({
    currentUser: { uid: 'test-uid' },
  })),
  signInWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(() => {}),
  orderBy: jest.fn(() => {}),
  limit: jest.fn(() => {}),
  query: jest.fn(() => {}),
  onSnapshot: jest.fn((q, callback) => {
    callback({
      docs: [
        {
          id: 'trip1',
          data: () => ({
            route: 'Kampala - Gulu',
            date: '2025-08-10',
          }),
        },
        {
          id: 'trip2',
          data: () => ({
            route: 'Lira - Mbale',
            date: '2025-08-09',
          }),
        },
      ],
    });

    return jest.fn(); // this is the mock unsubscribe function
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
