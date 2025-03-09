import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import './i18n'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import CoffeeTemplate1 from './templates/CoffeeTemplate1';
import menuData from './assets/menu.json';
import TemplateManager from './components/TemplateManager';
import Marketplace from './pages/Marketplace';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/Login'))
const SignUp = React.lazy(() => import('./pages/Singup'))
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'))
const Business = React.lazy(() => import('./pages/Business'))
const Overview = React.lazy(() => import('./pages/dashboard/Overview'))
const MenuSettings = React.lazy(() => import('./pages/dashboard/MenuSettings'))
const Categories = React.lazy(() => import('./pages/dashboard/products/Categories'))
const Products = React.lazy(() => import('./pages/dashboard/products/Products'))
const Supplements = React.lazy(() => import('./pages/dashboard/products/Supplements'))


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/business" element={<Business />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Overview />} />
              <Route path="menu-settings" element={<MenuSettings />} />
              <Route path="products/categories" element={<Categories />} />
              <Route path="products/list" element={<Products />} />
              <Route path="products/supplements" element={<Supplements />} />
              {/* Add other dashboard routes here */}
            </Route>
            <Route 
              path="/marketplace" 
              element={<Marketplace />} 
            />
            <Route 
              path="/coffee-template" 
              element={<CoffeeTemplate1 menuData={menuData} />} 
            />
            {/* Add the templates route */}
            
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  )
}

export default App