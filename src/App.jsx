import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import './i18n'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import { ThemeProvider } from './context/ThemeContext';
// import menuData from './assets/menu.json'; // Not needed anymore
import Marketplace from './pages/Marketplace';
import templates from './config/templates';
import CacheClearer from './components/CacheClearer';
import Menu from './pages/Menu';
import DemoTemplate from './components/templates/DemoTemplate.jsx';
import BusinessProfile from './pages/BusinessProfile';
import Businesses from './pages/Businesses';
import FloatingThemeToggle from './components/FloatingThemeToggle';
import { useDispatch } from 'react-redux';
import { login } from './redux/Slice/authSlice';

// Lazy load pages
import Home from './pages/Home'
import Templates from './pages/dashboard/Templates'
const Login = React.lazy(() => import('./pages/Login'))
const SignUp = React.lazy(() => import('./pages/Singup'))
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'))
const Business = React.lazy(() => import('./pages/Business'))
const Privacy = React.lazy(() => import('./pages/Privacy'))

const Overview = React.lazy(() => import('./pages/dashboard/Overview'))
const MenuSettings = React.lazy(() => import('./pages/dashboard/MenuSettings'))
const OwnerTemplate = React.lazy(() => import('./pages/dashboard/OwnerTemplate'))
const Categories = React.lazy(() => import('./pages/dashboard/products/Categories'))
const Products = React.lazy(() => import('./pages/dashboard/products/Products'))
const Supplements = React.lazy(() => import('./pages/dashboard/products/Supplements'))
const Profile = React.lazy(() => import('./pages/dashboard/Profile'))
const Settings = React.lazy(() => import('./pages/Settings'))
const MyBusiness = React.lazy(() => import('./pages/dashboard/MyBusiness'))
const DashboardExportMenu = React.lazy(() => import('./pages/dashboard/ExportMenu'))


function App() {
  const dispatch = useDispatch();

  // Rehydrate Redux auth state from localStorage on app load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      dispatch(login(JSON.parse(user)));
    }
  }, [dispatch]);

  // Check if we should show the cache clearer (in development or with debug parameter)
  const showCacheClearer = process.env.NODE_ENV === 'development' ||
                          window.location.search.includes('debug=true');

  // Hide FloatingThemeToggle on template demo routes
  const location = typeof window !== 'undefined' ? window.location : { pathname: '' };
  const isTemplateDemo = location.pathname.includes('/templates/') && location.pathname.includes('demo');

  return (
    <ThemeProvider>
      <MuiThemeProvider theme={theme}>
        <Router>
          {!isTemplateDemo && <FloatingThemeToggle />}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/discover" element={<Businesses />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Protected Business Route with ID parameter */}
            <Route path="/business/:userId" element={
              <ProtectedRoute>
                <Business />
              </ProtectedRoute>
            } />

            {/* Fallback Business Route (redirects to specific business based on user ID) */}
            <Route path="/business" element={
              <ProtectedRoute>
                <Business />
              </ProtectedRoute>
            } />

            {/* Protected Dashboard Route (for both admin and client users) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="menu-settings" element={<MenuSettings />} />
              <Route path="ownerTheme" element={<OwnerTemplate />} />
              <Route path="products/categories" element={<Categories />} />
              <Route path="products/list" element={<Products />} />
              <Route path="products/supplements" element={<Supplements />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="my-business" element={<MyBusiness />} />
              <Route path="my-business/:businessId" element={<MyBusiness />} />
              <Route path="templates" element={<Templates />} />
              <Route
                path="marketplace"
                element={<Marketplace />}
              />
              <Route
                path="export-menu"
                element={<DashboardExportMenu />}
              />

              {/* Add other dashboard routes here */}
            </Route>

            {/* Template Demo Routes */}
            <Route path="/templates/default" element={<DemoTemplate componentName="DefaultTemplate" />} />
            <Route path="/templates/dynamic" element={<DemoTemplate componentName="DynamicTemplate" />} />
            <Route path="/templates/coffee" element={<DemoTemplate componentName="CoffeTemplateSimple" />} />
            <Route path="/templates/minimalist" element = {<DemoTemplate componentName="MinimalistTemplate" />}/>
            <Route path="/templates/Glass-Frost" element = {<DemoTemplate componentName="GlassFrostTemplate" />}/>
            <Route path="/templates/glass" element = {<DemoTemplate componentName="GlassFlowTemplate" />}/>
            <Route path="/templates/wood" element = {<DemoTemplate componentName="RusticWood" />}/>
            <Route path="/templates/elegant" element = {<DemoTemplate componentName="ElegantTemplate" />}/>

           
            {/* Generic template routes for dynamic component names */}
            <Route path="/template/:componentName" element={<DemoTemplate />} />
            <Route path="/templates/:componentName" element={<DemoTemplate />} />

            {/* Menu Route with code parameter */}
            <Route path="/menu/:code" element={<Menu />} />

            {/* Business Profile Route */}
            <Route path="/business-profile/:id" element={<BusinessProfile />} />

            {/* Add dynamic template demo routes from config */}
            {templates.map(template => (
              <Route
                key={template.id}
                path={template.demoPath}
                element={<DemoTemplate componentName={template.name} />}
              />
            ))}
          </Routes>
        </Suspense>
      </Router>
      </MuiThemeProvider>
    </ThemeProvider>
  )
}

export default App