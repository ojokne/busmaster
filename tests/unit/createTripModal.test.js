import { render, waitFor, screen, userEvent } from '@testing-library/react-native';
import CreateTripModal from '../../components/CreateTripModal';

describe('Create trip modal', () => {
  test('renders modal title and close button', async () => {
    render(<CreateTripModal />);

    await waitFor(() => screen.getByTestId('modal-title'));
    expect(screen.getByTestId('modal-title')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('close-button'));
    expect(screen.getByTestId('close-button')).toBeOnTheScreen();
  });

  test('renders  modal input fields', async () => {
    render(<CreateTripModal />);

    await waitFor(() => screen.getByTestId('input-from'));
    expect(screen.getByTestId('input-from')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('input-to'));
    expect(screen.getByTestId('input-to')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('input-bus-reg'));
    expect(screen.getByTestId('input-bus-reg')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('input-date'));
    expect(screen.getByTestId('input-date')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('input-time'));
    expect(screen.getByTestId('input-time')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('submit-button'));
    expect(screen.getByTestId('submit-button')).toBeOnTheScreen();
  });

  test('renders error message input fields are empty when create trip button is pressed', async () => {
    const user = userEvent.setup();
    render(<CreateTripModal />);

    const createTripButton = screen.getByTestId('submit-button');

    user.press(createTripButton);
    await waitFor(() => screen.getByTestId('feedback-message'));
    expect(screen.getByTestId('modal-title')).toBeOnTheScreen();
  });
});
