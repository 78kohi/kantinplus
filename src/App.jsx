import { useState } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import NavBar from './components/NavBar'
import Footer from './components/Footer';
import CartPill from './components/CartPill';
import Toast from './components/Toast';

function App() {
  const activePage = window.location.pathname === '/' ? 'home' : window.location.pathname.substring(1);
  let showToast = false;

  return (
    <>
      <NavBar activePage={activePage} />
      <Home />
      <Products />
      <Footer />
      
      <CartPill />
      {showToast && <Toast />}
    </>
  )
}

export default App
