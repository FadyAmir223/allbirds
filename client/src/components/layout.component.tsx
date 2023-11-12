import { Outlet } from 'react-router-dom'

import Header from './header/header.component'
import Footer from './footer.component'

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
