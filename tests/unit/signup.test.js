import SignupScreen from '@/app/signup';
import { render, screen, userEvent, waitFor } from '@testing-library/react-native';

describe('Signup Screen', () => {
  test('Renders signup screen form fields', async () => {
    render(<SignupScreen />);

    await waitFor(() => screen.getByTestId('signup-header'));
    expect(screen.getByTestId('signup-header')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('email'));
    expect(screen.getByTestId('email')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('password'));
    expect(screen.getByTestId('password')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('togglePassword'));
    expect(screen.getByTestId('togglePassword')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('signupButton'));
    expect(screen.getByTestId('signupButton')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('signinLink'));
    expect(screen.getByTestId('signinLink')).toBeOnTheScreen();
  });

  test('Accepts input and submits signup form', async () => {
    const user = userEvent.setup();
    const onSignup = jest.fn();

    render(<SignupScreen onSignup={onSignup} />);

    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const togglePasswordBtn = screen.getByTestId('togglePassword');
    const signUpButton = screen.getByTestId('signupButton');

    await user.type(emailInput, 'newuser@example.com');
    await user.type(passwordInput, 'securepassword');
    await user.press(togglePasswordBtn);

    // Submit form
    await user.press(signUpButton);
    expect(onSignup).toHaveBeenCalledWith('newuser@example.com', 'securepassword');
  });

  test('Shows error for invalid email', async () => {
    const user = userEvent.setup();
    render(<SignupScreen />);

    await user.type(screen.getByTestId('email'), 'not-an-email');
    await user.type(screen.getByTestId('password'), 'password123');
    await user.press(screen.getByTestId('signupButton'));

    expect(await screen.findByText(/invalid email address/i)).toBeTruthy();
  });

  test('Shows error for short password', async () => {
    const user = userEvent.setup();
    render(<SignupScreen />);

    await user.type(screen.getByTestId('email'), 'test@example.com');
    await user.type(screen.getByTestId('password'), '123');
    await user.press(screen.getByTestId('signupButton'));

    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeTruthy();
  });
});
