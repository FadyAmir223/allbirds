import Hero from '../components/hero.component';
import BestSellingGifts from '../components/best-selling-gifts.component';

export const Home = () => {
  return (
    <main className='lg:pt-7'>
      <Hero />
      <BestSellingGifts />
    </main>
  );
};
