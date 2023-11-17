import Hero from '../components/hero.component';
import Slider from '../components/slider.component';
import SaleAd from '../components/sale-ad.component';
import EmailServiceForm from '../components/email-service-form.component';

export const Home = () => {
  return (
    <main className='lg:pt-7'>
      <Hero />

      {/* best selling gifts */}
      <Slider
        title='our best-selling gifts'
        sectionDesctop='on'
        cardAppendix='on'
      />

      {/* stay dry */}
      <SaleAd
        imgUrl='/images/main-page/secondary-hero/23Q4-Holiday_Ch2-P1-Site-Secondary_Hero-2-Desktop-3840___2346-v2.webp'
        imgUrlMobile='/images/main-page/secondary-hero/23Q4-Holiday_Ch2-P1-Site-Secondary_Hero-2-Mobile-750x974.webp'
        headerText='stay dry. save big.'
        paragraphText='Save 20% on our best-selling warm, water-repellent styles.'
      />

      {/* TODO: use /api/collections/sale */}
      {/* <Slider title='now on sale' /> */}

      {/* keep calm & travel on */}
      <SaleAd
        imgUrl='/images/main-page/holiday/23Q4-Holiday_Ch1-Site-Secondary_Hero-2-Desktop-3840___2346.webp'
        imgUrlMobile='/images/main-page/holiday/23Q4-Holiday_Ch1-Site-Secondary_Hero-2-Mobile-750x974.webp'
        headerText='keep calm and travel on'
        paragraphText='With cushy soles and a zen color palette that makes your feet say ahhh.'
      />

      {/* collections */}
      <Slider title='shop the collections' />

      {/* updates less carbon */}
      <SaleAd
        imgUrl='/images/main-page/secondary-home/Secondary_Homepage_Desktop_-_Sustainability.webp'
        imgUrlMobile='/images/main-page/secondary-home/Secondary_Homepage_Mobile_-_Sustainability.webp'
        headerText='more updated about less carbon'
        paragraphText='Reducing the carbon footprint of our products is at the heart of everything we do. And we’ve got good news: we continue to make headway. Read about our progress from 2022 in our latest Flight Status report.'
        links={[
          {
            text: 'our sustainability strategy',
            url: '/sustainable-practices',
          },
        ]}
      />

      {/* stories */}
      <Slider title='stories' />

      <EmailServiceForm />

      {/* <Approach /> */}

      {/* <Footer /> */}
    </main>
  );
};
