import SigninScreen from '@/app/signin';
import { render, screen, waitFor } from '@testing-library/react-native';

describe('Signin Screen', () => {
  test('Renders login screen form fields', async () => {
    render(<SigninScreen />);
    await waitFor(()=> screen.getByTestId("signin-header"))

    expect(screen.getByTestId("signin-header")).toBeOnTheScreen()
  });
});
