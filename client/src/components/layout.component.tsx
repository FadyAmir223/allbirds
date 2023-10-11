import { Outlet } from 'react-router-dom';
import Header from '../routes/header.component';
import Footer from '../routes/footer.component';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
