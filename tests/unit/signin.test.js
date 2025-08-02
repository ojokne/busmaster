import SigninScreen from '@/app/signin';
import { render, screen, userEvent, waitFor } from '@testing-library/react-native';

describe('Signin Screen', () => {
  test('Renders login screen form fields', async () => {
    render(<SigninScreen />);
    await waitFor(() => screen.getByTestId('signin-header'));

    expect(screen.getByTestId('signin-header')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('email'));
    expect(screen.getByTestId('email')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('password'));
    expect(screen.getByTestId('password')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('showPassword'));
    expect(screen.getByTestId('showPassword')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('signinButton'));
    expect(screen.getByTestId('signinButton')).toBeOnTheScreen();

    await waitFor(() => screen.getByTestId('signupLink'));
    expect(screen.getByTestId('signupLink')).toBeOnTheScreen();
  });

  test('Sign in accepts input and submits', async () => {
    const user = userEvent.setup();
    const onLogin = jest.fn();
    render(<SigninScreen onLogin={onLogin} />);
    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const togglePasswordBtn = screen.getByTestId('showPassword');
    const signInButton = screen.getByTestId('signinButton');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    await user.press(togglePasswordBtn);

    await user.press(signInButton);
    expect(onLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('shows error and prevents login on invalid email', async () => {
    const mockLogin = jest.fn(); // should not be called
    const user = userEvent.setup();

    render(<SigninScreen onLogin={mockLogin} />);

    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const signInButton = screen.getByTestId('signinButton');

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');

    await user.press(signInButton);

    expect(await screen.findByText(/invalid email address/i)).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('shows error and prevents login on short password', async () => {
    const mockLogin = jest.fn();
    const user = userEvent.setup();

    render(<SigninScreen onLogin={mockLogin} />);

    await user.type(screen.getByTestId('email'), 'test@example.com');
    await user.type(screen.getByTestId('password'), '123');

    await user.press(screen.getByTestId('signinButton'));

    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
