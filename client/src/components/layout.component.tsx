import { Outlet } from 'react-router-dom'

import Footer from './footer.component'
import Header from './header/header.component'

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout
