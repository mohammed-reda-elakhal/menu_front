# Meniwi Project Summary

## Project Overview
Meniwi is a comprehensive digital menu management platform designed for restaurants, cafes, and food service businesses. The application enables business owners to create, manage, and share interactive digital menus with customers through QR codes and web links, enhancing the dining experience while simplifying menu management.

## Technology Stack

### Frontend
- **Framework**: React with Vite as the build tool
- **State Management**: Redux with Redux Toolkit
- **Routing**: React Router v7
- **Styling**: 
  - Tailwind CSS for utility-based styling
  - Material UI components
  - Framer Motion for animations
  - GSAP for advanced animations
- **UI Libraries**:
  - Headless UI for accessible components
  - Heroicons and React Icons for iconography
  - Tremor for dashboard components
- **Data Visualization**:
  - Nivo, Chart.js, and Recharts for charts and graphs
- **Form Handling**: Formik with Yup for validation
- **API Communication**: Axios for HTTP requests
- **Internationalization**: i18next for multilingual support
- **Image Processing**: react-easy-crop for image cropping

### Backend
The backend is a separate service with RESTful API endpoints that the frontend communicates with through configured API calls.

## Core Features

### Authentication & User Management
- User registration and login
- Role-based access control (admin and client users)
- Profile management with image upload
- Session management with JWT tokens stored in localStorage

### Business Management
- Business profile creation and management
- Business details including:
  - Name, description, logo
  - Location information
  - Contact details
  - Operating hours with open/closed status
  - Social media links
  - Tags for categorization
- Business rating system for guests
- Business discovery with filtering options

### Menu Management
- Digital menu creation with unique codes
- Menu publishing controls
- QR code generation for menus
- Menu templates with customization options
- Social media visibility settings

### Product Management
- Product categories organization
- Product creation with details:
  - Name, description, price
  - Promotional pricing
  - Images with cropping functionality
  - Visibility controls
- Product rating system
- Supplements/add-ons management

### Templates System
- Customizable menu templates
- Template marketplace
- Dynamic template loading based on selection
- Template preview functionality

### Multilingual Support
- Support for English, French, and Arabic
- RTL layout support for Arabic
- Language detection and switching
- Localized content throughout the application

### Theme System
- Light and dark mode support
- Theme persistence in localStorage
- System preference detection
- Floating theme toggle accessible across the application

## Application Structure

### Pages
- **Public Pages**:
  - Home/Landing page
  - Login and Signup
  - Business discovery
  - Business profiles
  - Menu viewing
  - Privacy policy
- **Protected Pages**:
  - Dashboard
  - Business management
  - Menu settings
  - Product management
  - Profile settings
  - Template selection

### Components
- Reusable UI components (Modal, LoadingSpinner, etc.)
- Business-related components (BusinessSettings, BusinessRating, etc.)
- Menu-related components (MenuSettings, etc.)
- Template components (TemplateLoader, TemplateFactory, etc.)
- Dashboard components (Sidebar, Navbar, etc.)

### State Management
The application uses Redux with multiple slices:
- `authSlice`: Authentication state
- `businessSlice`: Business data and operations
- `personSlice`: User profile data
- `menuSlice`: Menu data and operations
- `categorieSlice`: Category management
- `produitSlice`: Product management
- `supplementaireSlice`: Supplements/add-ons
- `templateSlice`: Template management

## UI/UX Design
- Modern UI with rounded borders
- Responsive design for all device sizes
- Tailwind CSS styling with consistent components
- Dark/light mode with smooth transitions
- Animations with Framer Motion
- Masonry layout for card displays
- Floating action buttons
- Consistent color palette

## Special Features
- QR code generation for menu sharing
- Image cropping for uploads
- Rating systems for businesses and products
- Similar business recommendations
- Operating hours display with open/closed status
- Multilingual support with RTL layout
- Template customization system
- Business type categorization

## Deployment
- Configured for Vercel deployment
- Production API endpoint configured
- Cache management for updates

## Development Tools
- ESLint for code quality
- Vite for fast development and building
- Environment variable management
