import { useState } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import NavBar from './components/NavBar'
import Footer from './components/Footer';

function App() {
  const activePage = window.location.pathname === '/' ? 'home' : window.location.pathname.substring(1);

  return (
    <>
      <NavBar activePage={activePage} />
      <Home />
      <Products />
      <Footer />
    </>
  )
}

export default App
