import { useState } from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router';
import Payment from './pages/Payment';

function App() {
  const activePage = window.location.pathname === '/' ? 'home' : window.location.pathname.substring(1);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bayar" element={<Payment />} />
    </Routes>
  )
}

export default App
