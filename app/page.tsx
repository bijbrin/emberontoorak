import { BookingProvider } from './contexts/BookingContext';
import Header from './components/Header';
import Hero from './components/Hero';
import TheatreOfFire from './components/TheatreOfFire';
import SignatureDishes from './components/SignatureDishes';
import WineList from './components/WineList';
import Footer from './components/Footer';
import BookingPanel from './components/BookingPanel';

export default function Home() {
  return (
    <BookingProvider>
      <Header />
      <BookingPanel />
      <main>
        <Hero />
        <TheatreOfFire />
        <SignatureDishes />
        <WineList />
      </main>
      <Footer />
    </BookingProvider>
  );
}
