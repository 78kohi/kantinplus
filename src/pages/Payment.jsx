import React from 'react';
import OrderSummary from '../components/OrderSummary';

export default function Payment() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigasi Step (Shopping Cart -> Checkout -> Successful) */}
        <div className="flex justify-center items-center space-x-8 mb-10 text-sm font-semibold text-slate-400">
          <span className="text-slate-500">1. Shopping cart</span>
          <span>&gt;</span>
          <span className="text-blue-900 font-bold border-b-2 border-blue-900 pb-1">2. Checkout</span>
          <span>&gt;</span>
          <span>3. Successful</span>
        </div>

        {/* Layout 2 Kolom Sesuai UI Referensi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* SISI KIRI: Payment Details & Metode Pembayaran */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Payment details</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Payment method</label>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="payment" defaultChecked className="text-blue-900" />
                  <span className="text-sm font-medium text-slate-800">Pay with Bank Transfer (Navy Account)</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="payment" className="text-blue-900" />
                  <span className="text-sm font-medium text-slate-800">Pay with E-Wallet / QRIS</span>
                </label>
              </div>
            </div>

            {/* Billing Details */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-bold text-slate-900 text-sm">Billing details</h4>
              
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Mobile number</label>
                <input 
                  type="text" 
                  placeholder="Enter your mobile number" 
                  className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Additional information / Order note</label>
                <textarea 
                  placeholder="Note for Gabin Fla (e.g. extra crispy)" 
                  className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  rows="2"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Enter coupon code</label>
                <input 
                  type="text" 
                  placeholder="Promo code" 
                  className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

          </div>

          {/* SISI KANAN: Order Details / Summary */}
          <div>
            <OrderSummary />
          </div>

        </div>
      </div>
    </div>
  );
}