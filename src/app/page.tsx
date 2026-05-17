import Hero from './components/Hero';
import TheatreOfFire from './components/TheatreOfFire';
import MenuIntro from './components/MenuIntro';
import SignatureDishes from './components/SignatureDishes';
import WineList from './components/WineList';
import Footer from '@/components/layout/Footer';
import BookingPanel from './components/BookingPanel';
import JsonLd from '@/components/ui/JsonLd';

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Ember on Toorak',
  description:
    'An immersive fire-driven dining experience in Toorak, Victoria. 28-day dry-aged beef over 1,200° coals.',
  url: 'https://www.emberontoorak.com.au',
  image: 'https://www.emberontoorak.com.au/og-image.jpg',
  telephone: '+61 3 9824 7600',
  email: 'reservations@emberontoorak.com.au',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '328 Toorak Road',
    addressLocality: 'Toorak',
    addressRegion: 'VIC',
    postalCode: '3142',
    addressCountry: 'AU',
  },
  servesCuisine: ['Australian', 'Steakhouse', 'Contemporary'],
  priceRange: '$$$',
  acceptsReservations: true,
  hasMenu: 'https://www.emberontoorak.com.au/menu',
  reservationUrl: 'https://www.emberontoorak.com.au/reservations',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '11:00',
      closes: '21:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday'],
      opens: '11:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday'],
      opens: '11:00',
      closes: '21:00',
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={restaurantSchema} />
      <BookingPanel />
      <main>
        <Hero />
        <TheatreOfFire />
        <MenuIntro />
        <SignatureDishes />
        <WineList />
      </main>
      <Footer />
    </>
  );
}
