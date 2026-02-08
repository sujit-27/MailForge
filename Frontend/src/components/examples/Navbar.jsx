import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import Navbar from '../LandingPage/Navbar';

export default function NavbarExample() {
  return (
    <Provider store={store}>
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="p-8">
          <h1 className="text-2xl">Content below navbar</h1>
        </div>
      </div>
    </Provider>
  );
}
