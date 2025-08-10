import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import HomeScreen from '../../app/(stack)/(tabs)';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('HomeScreen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockPush.mockClear();
    useRouter.mockReturnValue({ push: mockPush });
  });

  test('toggles showRevenue state when eye icon is pressed', async () => {
    render(<HomeScreen />);

    const toggleRevenueButton = screen.getByTestId('toggle-revenue');

    await waitFor(() => screen.getByTestId('total-revenue'));
    expect(screen.getByTestId('total-revenue')).toHaveTextContent('••••••');

    fireEvent.press(toggleRevenueButton);

    await waitFor(() => screen.getByTestId('total-revenue'));
    expect(screen.getByTestId('total-revenue')).toHaveTextContent(/ugx/i);

    fireEvent.press(toggleRevenueButton);

    await waitFor(() => screen.getByTestId('total-revenue'));
    expect(screen.getByTestId('total-revenue')).toHaveTextContent('••••••');
  });

  test('renders revenue and tickets sold titles', async () => {
    render(<HomeScreen />);

    await waitFor(() => screen.getByTestId('homescreen-header'));
    expect(screen.getByTestId('homescreen-header')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('revenue-card-title'));
    expect(screen.getByTestId('homescreen-header')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('tickets-sold-card-title'));
    expect(screen.getByTestId('tickets-sold-card-title')).toBeOnTheScreen();
  });

  test('shows tickets sold number correctly', async () => {
    render(<HomeScreen />);

    await waitFor(() => screen.getByTestId('total-tickets-sold'));
    expect(screen.getByTestId('total-tickets-sold')).toHaveTextContent(/[0-9]+/);
  });

  test('displays  section titles', async () => {
    render(<HomeScreen />);

    await waitFor(() => screen.getByTestId('quick-actions-title'));
    expect(screen.getByTestId('total-tickets-sold')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('sell-ticket'));
    expect(screen.getByTestId('sell-ticket')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('create-trip'));
    expect(screen.getByTestId('create-trip')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('recent-trips'));
    expect(screen.getByTestId('recent-trips')).toBeOnTheScreen();
  });

  test('navigates to Sell Ticket screen when Sell Ticket button is pressed', () => {
    render(<HomeScreen />);

    const sellTicketButton = screen.getByTestId('sell-ticket');
    fireEvent.press(sellTicketButton);
    expect(mockPush).toHaveBeenCalledWith('/sell-ticket');
  });

  test('navigates to Create Trip screen when Create Trip button is pressed', async () => {
    render(<HomeScreen />);

    const createTripButton = screen.getByTestId('create-trip');
    fireEvent.press(createTripButton);
    expect(mockPush).toHaveBeenCalledWith('/create-trip');
  });
});
