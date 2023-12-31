import { useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Approach } from '../components/approach.component'
import EmailServiceForm from '../components/email-service-form.component'
import Hero from '../components/hero.component'
import SaleAd from '../components/sale-ad.component'
import { SectionDesktop, Slider } from '../components/slider.component'
import Head from '@/components/head.component'
import { Spinner } from '@/components/spinner.component'
import gifts from '../data/gifts.json'
import shopCollections from '../data/shop-collections.json'
import stories from '../data/stories.json'
import { refactorCollectionsToSlides } from '..'
import { collectionSaleQuery } from '@/features/collections'

export const Home = () => {
  const query = { type: 'shoes' }

  const [
    { data: saleMen, isLoading: isLoadingSaleMen },
    { data: saleWomen, isLoading: isLoadingSaleWomen },
  ] = useQueries({
    queries: [
      collectionSaleQuery({ ...query, gender: 'mens' }),
      collectionSaleQuery({ ...query, gender: 'womens' }),
    ],
  })

  const [saleProducts, setSaleProducts] = useState<SectionDesktop[] | null>(
    null,
  )

  useEffect(() => {
    if (saleMen && saleWomen)
      setSaleProducts(refactorCollectionsToSlides([saleMen, saleWomen]))
  }, [saleMen, saleWomen])

  return (
    <main className='lg:pt-7'>
      <Head title='home' description='sustainable shoes & clothing' />

      <Hero />

      <Slider
        title='our best-selling gifts'
        sectionDesctop={true}
        cardAppendix={true}
        slides={gifts}
      />

      {/* stay dry */}
      <SaleAd
        imgUrl='/images/main-page/secondary-hero/23Q4-Holiday_Ch2-P1-Site-Secondary_Hero-2-Desktop-3840___2346-v2.webp'
        imgUrlMobile='/images/main-page/secondary-hero/23Q4-Holiday_Ch2-P1-Site-Secondary_Hero-2-Mobile-750x974.webp'
        headerText='stay dry. save big.'
        paragraphText='Save 20% on our best-selling warm, water-repellent styles.'
      />

      {saleProducts && !isLoadingSaleMen && !isLoadingSaleWomen ? (
        <Slider title='now on sale' slides={saleProducts} />
      ) : (
        <Spinner />
      )}

      {/* keep calm & travel on */}
      <SaleAd
        imgUrl='/images/main-page/holiday/23Q4-Holiday_Ch1-Site-Secondary_Hero-2-Desktop-3840___2346.webp'
        imgUrlMobile='/images/main-page/holiday/23Q4-Holiday_Ch1-Site-Secondary_Hero-2-Mobile-750x974.webp'
        headerText='keep calm and travel on'
        paragraphText='With cushy soles and a zen color palette that makes your feet say ahhh.'
      />

      <Slider title='shop the collections' slides={shopCollections} />

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

      <Slider title='stories' slides={stories} />

      <EmailServiceForm />
      <Approach />
    </main>
  )
}
