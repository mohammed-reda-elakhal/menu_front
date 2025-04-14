import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import './i18n'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import menuData from './assets/menu.json';
import Marketplace from './pages/Marketplace';
import templates from './config/templates';
import CacheClearer from './components/CacheClearer';

// Lazy load pages
import Home from './pages/Home'
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
  // Check if we should show the cache clearer (in development or with debug parameter)
  const showCacheClearer = process.env.NODE_ENV === 'development' ||
                          window.location.search.includes('debug=true');

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
            {/* Add dynamic template demo routes */}
            {templates.map(template => (
              <Route
                key={template.id}
                path={template.demoPath}
                element={<template.component menuData={menuData} />}
              />
            ))}
          </Routes>
        </Suspense>

        {/* Add the cache clearer component */}
        {showCacheClearer && <CacheClearer />}
      </Router>
    </ThemeProvider>
  )
}

export default App