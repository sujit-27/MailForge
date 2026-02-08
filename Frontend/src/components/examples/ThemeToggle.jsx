import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <Provider store={store}>
      <div className="p-8 bg-background">
        <ThemeToggle />
      </div>
    </Provider>
  );
}
