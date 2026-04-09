import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FilterProvider } from './Context/FilterContext.jsx'
import { CartProvider } from './Context/CartContext.jsx'
import {ScrollToTop} from './components/Others/ScrollToTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> 
    <FilterProvider>
      <CartProvider>
      <ScrollToTop/>
      <App />
      </CartProvider>
    </FilterProvider>
    </BrowserRouter>
  </StrictMode>
)