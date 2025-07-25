import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { FiHome, FiShoppingBag, FiCompass, FiShield, FiLogIn, FiUserPlus } from 'react-icons/fi'

// MUI components
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useScrollTrigger,
  Slide,
} from '@mui/material'

// MUI icons
import MenuIcon from '@mui/icons-material/Menu'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CloseIcon from '@mui/icons-material/Close'

// Import logo with fallback
import logo from '../assets/menu.png'
import '../styles/headerStyles.css'

// Hide AppBar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Header() {
  // Get theme context
  const { darkMode } = useTheme();

  // Define colors from Tailwind config
  const colors = {
    primary: '#3768e5',
    secondary1: '#01021b',
    secondary2: '#757de8',
    gray_bg: '#e7e7e7',
    gray_text: '#333333',
  };

  const languages = [
    {
      code: 'en',
      label: 'English',
      flag: '🇬🇧',
    },
    {
      code: 'fr',
      label: 'Français',
      flag: '🇫🇷',
    },
    {
      code: 'ar',
      label: 'العربية',
      flag: '🇸🇦',
    },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorElLang, setAnchorElLang] = useState(null);
  const [themeState, setThemeState] = useState(darkMode);
  const { t, i18n } = useTranslation();

  // Force re-render when darkMode changes
  useEffect(() => {
    setThemeState(darkMode);
  }, [darkMode]);

  const navigation = [
    { name: t('header.navigation.home'), href: '/', icon: <FiHome size={16} /> },
    { name: t('header.navigation.businesses'), href: '/discover', icon: <FiCompass size={16} /> },
    { name: t('header.navigation.Privacy'), href: '/privacy', icon: <FiShield size={16} /> },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // For RTL support
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    handleCloseLangMenu();
  };

  const handleOpenLangMenu = (event) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  const handleDrawerToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Custom styles for MUI components
  const styles = {
    appBar: {
      background: 'none',
      boxShadow: 'none',
      minHeight: { xs: '56px', sm: '60px' },
      width: { xs: '96%', md: '90%', lg: '80%' },
      margin: '12px auto 0',
      left: { xs: '2%', md: '5%', lg: '10%' },
      transition: 'all 0.3s ease-in-out',
      borderRadius: { xs: '25px', sm: '50px' },
      overflow: 'hidden',
      '& .MuiContainer-root': {
        background: `linear-gradient(150deg,
          ${colors.secondary1}f9,
          ${colors.primary}85)`,
        backgroundSize: '200% 200%',
        animation: 'gradient 15s ease infinite',
        borderRadius: 'inherit',
        backdropFilter: 'blur(10px)',
      },
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      minHeight: { xs: '60px', sm: '64px' },
      padding: { xs: '0 16px', sm: '0 24px' },
      gap: { xs: '8px', sm: '16px' },
      width: '100%',
      transition: 'all 0.3s ease-in-out',
      '& .MuiButton-root': {
        color: darkMode ? colors.gray_bg : '#475569', // text-slate-600 for light mode
      },
      '& .MuiIconButton-root': {
        color: darkMode ? colors.gray_bg : '#475569',
      }
    },
    logo: {
      height: { xs: '30px', sm: '32px' },
      margin: { xs: '0 auto', sm: '0 8px 0 0' },
    },
    menuButton: {
      color: colors.gray_bg,
      marginLeft: '4px',
      display: { xs: 'flex', md: 'none' },
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: `${colors.primary}20`,
      },
    },
    navMenu: {
      display: { xs: 'block', lg: 'none' },
    },
    navItem: {
      my: 1.5,
      color: darkMode ? colors.gray_bg : '#475569', // text-slate-600
      display: 'block',
      fontWeight: 500,
      fontSize: '0.8rem',
      textTransform: 'none',
      mx: 0.75,
      position: 'relative',
      textAlign: 'center',
      transition: 'all 0.3s ease-in-out',
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '0%',
        height: '2px',
        bottom: '-4px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: darkMode ? colors.primary : 'white',  // Updated for light mode
        transition: 'width 0.3s ease-in-out',
      },
      '&:hover': {
        color: darkMode ? colors.primary : '#3B82F6', // text-blue-500
        transform: 'translateY(-2px)',
        '&::after': {
          width: '100%',
        },
      },
    },
    desktopMenu: {
      flexGrow: 1,
      display: { xs: 'none', lg: 'flex' },
      justifyContent: 'center',
    },
    authButtons: {
      display: { xs: 'none', md: 'flex', lg: 'flex' },
      gap: '12px',
      alignItems: 'center',
    },
    loginButton: {
      color: darkMode ? colors.gray_bg : '#475569', // text-slate-600
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.8rem',
      mx: 0.75,
      padding: '8px 20px',
      borderRadius: '12px',
      background: 'transparent',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
      '&:hover': {
        color: darkMode ? colors.primary : '#3B82F6', // text-blue-500
        transform: 'translateY(-2px)',
        background: 'transparent',
      },
      '&:active': {
        transform: 'translateY(1px)',
      },
    },
    signupButton: {
      color: darkMode ? colors.primary : '#3B82F6', // text-blue-500
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.8rem',
      borderRadius: '12px',
      padding: '8px 20px',
      mx: 0.75,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
      border: `1px solid ${darkMode ? colors.primary : '#93C5FD'}`, // border-blue-300
      background: 'transparent',
      '&:hover': {
        background: darkMode ? `${colors.primary}15` : 'rgba(59, 130, 246, 0.1)', // bg-blue-500/10
        transform: 'translateY(-2px)',
        boxShadow: darkMode ? '0 4px 12px rgba(55, 104, 229, 0.2)' : '0 4px 12px rgba(255, 255, 255, 0.1)',  // Updated for light mode
      },
      '&:active': {
        transform: 'translateY(1px)',
      },
    },
    langButton: {
      color: darkMode ? colors.gray_bg : '#475569', // text-slate-600
      backgroundColor: 'transparent',
      border: `1px solid ${darkMode ? `${colors.gray_bg}30` : '#E2E8F0'}`, // border-slate-200
      borderRadius: '12px',
      padding: '8px',
      minWidth: '42px',
      height: '42px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        backgroundColor: `${colors.primary}15`,
        borderColor: darkMode ? colors.primary : '#3B82F6', // border-blue-500
        transform: 'translateY(-2px)',
      },
    },
    langMenu: {
      mt: '35px',
    },
    langMenuItem: {
      minWidth: 120,
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      fontSize: '0.75rem',
      padding: '6px 10px',
    },
    drawer: {
      width: { xs: 240, sm: 260 },
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: { xs: 240, sm: 260 },
        backgroundColor: 'transparent', // Will be set by the gradient
        color: darkMode ? colors.gray_bg : 'white',
        boxSizing: 'border-box',
        background: darkMode
          ? 'linear-gradient(to bottom, rgba(1, 2, 27, 0.98), rgba(55, 104, 229, 0.85))'
          : 'linear-gradient(to bottom, rgba(239, 246, 255, 0.98), rgba(59, 130, 246, 0.85))',
        backdropFilter: 'blur(10px)',
      },
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      minHeight: '48px',
    },
    drawerItem: {
      color: darkMode ? colors.gray_bg : 'white',
      padding: '8px 16px',
      minHeight: '44px',
      transition: 'all 0.3s ease-in-out',
      borderRadius: '8px',
      margin: '4px 8px',
      textAlign: 'left', // Keep drawer items left-aligned for better UX
      '& .MuiListItemText-primary': {
        fontSize: '0.85rem',
      },
      '&:hover': {
        backgroundColor: `${colors.primary}15`,
        color: colors.primary,
        paddingLeft: '24px',
      },
    },
    activeDrawerItem: {
      backgroundColor: `${colors.primary}20`,
      color: colors.primary,
    },
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            ...styles.appBar,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              padding: '1px',
              background: `linear-gradient(150deg, ${colors.primary}30, ${colors.secondary2}20)`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              pointerEvents: 'none',
            }
          }}
          className="header-gradient glass-effect"
        >
          <Container
            maxWidth={false}
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transition: 'all 0.3s ease-in-out',
              color: darkMode ? colors.gray_bg : 'rgba(255, 255, 255, 0.95)', // Add this line
              '& *': { // Add this to affect all children
                color: 'inherit'
              }
            }}
          >
            {/* Gradient background */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                background: darkMode
                  ? 'linear-gradient(to bottom, #01021b, rgba(1, 2, 27, 0.95))'
                  : 'linear-gradient(to bottom, #EFF6FF, #FFFFFF)', // from-blue-50 to white
                backgroundSize: '200% 200%',
                animation: 'gradient 15s ease infinite',
              }}
            >
              {/* Enhanced background effects */}
              <Box sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
              }}>
                <Box sx={{
                  position: 'absolute',
                  bottom: '25%',
                  right: '25%',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  filter: 'blur(100px)',
                  animation: 'pulse 4s ease infinite',
                  backgroundColor: darkMode ? 'rgba(117, 125, 232, 0.1)' : 'rgba(96, 165, 250, 0.1)', // bg-blue-400/10
                }} />
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '400px',
                  height: '400px',
                  borderRadius: '50%',
                  filter: 'blur(120px)',
                  backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.05)' : 'rgba(59, 130, 246, 0.05)', // bg-blue-500/5
                }} />
              </Box>
            </Box>

            <Toolbar disableGutters sx={styles.toolbar}>
              {/* Mobile menu icon - positioned on the left */}
              <IconButton
                size="small"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                sx={{
                  color: darkMode ? colors.gray_bg : 'white',
                  display: { xs: 'flex', md: 'none' },
                  padding: { xs: '8px', sm: '10px' },
                  marginRight: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: `${colors.primary}20`,
                  }
                }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>

              {/* Logo - visible on all screens, centered on mobile */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: { xs: 1, md: 0 },
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                <Link to="/">
                  <Box
                    component="img"
                    src={logo}
                    alt="Logo"
                    sx={{
                      ...styles.logo,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  />
                </Link>
              </Box>

              {/* Desktop and tablet navigation */}
              <Box sx={{
                ...styles.desktopMenu,
                // Override to show on tablet as well
                display: { xs: 'none', md: 'flex', lg: 'flex' },
                // Adjust spacing for tablet
                justifyContent: { md: 'center', lg: 'center' },
                ml: { md: 2, lg: 4 },
                mr: { md: 2, lg: 4 },
              }}>
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    to={item.href}
                    className="text-modern"
                    sx={{
                      ...styles.navItem,
                      // Special handling for tablet
                      fontSize: { md: '0.7rem', lg: '0.8rem' },
                      my: { md: 1, lg: 1.5 },
                      mx: { md: 0.5, lg: 0.75 },
                      px: { md: 0.5, lg: 0.75 },
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Box
                      className="nav-icon"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'inherit',
                        transition: 'all 0.3s ease',
                        transform: 'translateY(0)',
                        '&:hover': {
                          transform: 'translateY(-2px) scale(1.1)',
                          color: colors.primary,
                        }
                      }}
                    >
                      {item.icon}
                    </Box>
                    {item.name}
                  </Button>
                ))}
              </Box>

              {/* Auth buttons and language selector - desktop and tablet */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Show auth buttons on desktop and tablet (md and up) */}
                <Box sx={{
                  ...styles.authButtons,
                  display: { xs: 'none', md: 'flex', lg: 'flex' },
                  gap: '12px',
                  alignItems: 'center',
                }}>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      ...styles.loginButton,
                      fontSize: { md: '0.75rem', lg: '0.8rem' },
                      '&:hover': {
                        ...styles.loginButton['&:hover'],
                        transform: 'translateY(-2px) scale(1.02)',
                      },
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <FiLogIn size={16} />
                    {t('header.auth.login')}
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    sx={{
                      ...styles.signupButton,
                      fontSize: { md: '0.75rem', lg: '0.8rem' },
                      '&:hover': {
                        ...styles.signupButton['&:hover'],
                        transform: 'translateY(-2px) scale(1.02)',
                      },
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <FiUserPlus size={16} />
                    {t('header.auth.signup')}
                  </Button>
                </Box>



                {/* Language selector button */}
                <Tooltip title={t('header.language')}>
                  <Button
                    onClick={handleOpenLangMenu}
                    sx={{
                      ...styles.langButton,
                      '&:hover': {
                        ...styles.langButton['&:hover'],
                        transform: 'translateY(-2px) scale(1.05)',
                      }
                    }}
                  >
                    <Box sx={{ fontSize: '1.2rem' }}>
                      {languages.find(lang => lang.code === i18n.language)?.flag || '🌐'}
                    </Box>
                  </Button>
                </Tooltip>
                <Menu
                  id="menu-language"
                  anchorEl={anchorElLang}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElLang)}
                  onClose={handleCloseLangMenu}
                  sx={{
                    mt: '10px',
                    '& .MuiPaper-root': {
                      backgroundColor: colors.secondary1,
                      border: `1px solid ${colors.primary}20`,
                      borderRadius: '8px',
                      backgroundImage: `linear-gradient(150deg, ${colors.secondary1}, ${colors.secondary1}f0)`,
                      backdropFilter: 'blur(10px)',
                    },
                  }}
                >
                  {languages.map((language) => (
                    <MenuItem
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      selected={i18n.language === language.code}
                      className="text-modern"
                      sx={{
                        ...styles.langMenuItem,
                        backgroundColor: i18n.language === language.code ? `${colors.primary}20` : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: `${colors.primary}20`,
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Box component="span" sx={{ mr: 1 }}>{language.flag}</Box>
                      <Typography>{language.label}</Typography>
                      {i18n.language === language.code && (
                        <Box sx={{ ml: 'auto', color: colors.primary }}>✓</Box>
                      )}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile drawer - only shown on xs and sm screens */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          ...styles.drawer,
          display: { xs: 'block', md: 'none' },
        }}
      >
        {/* Enhanced background effects for drawer */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <Box sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.1,
            animation: 'pulse 6s ease infinite',
            backgroundColor: darkMode ? colors.secondary2 : 'rgba(255, 255, 255, 0.5)',
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: '5%',
            left: '5%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity: 0.05,
            backgroundColor: darkMode ? colors.primary : 'rgba(255, 255, 255, 0.3)',
          }} />
        </Box>

        <Box sx={{
          ...styles.drawerHeader,
          position: 'relative',
          zIndex: 1,
          backdropFilter: 'blur(5px)',
        }}>
          <Box component="img" src={logo} alt="Logo" sx={{
            height: '32px',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }} />
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: darkMode ? colors.gray_bg : 'white',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: colors.primary,
                transform: 'rotate(90deg)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: `${colors.primary}20` }} />

        {/* Navigation items */}
        <List sx={{ position: 'relative', zIndex: 1 }}>
          {navigation.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                to={item.href}
                onClick={handleDrawerToggle}
                className="text-modern"
                sx={{
                  ...styles.drawerItem,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                    paddingLeft: '24px',
                    transform: 'translateY(-2px)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Box
                  className="drawer-nav-icon"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: colors.primary,
                    transition: 'all 0.3s ease',
                    borderRadius: '50%',
                    padding: '6px',
                    backgroundColor: `${colors.primary}15`,
                  }}
                >
                  {item.icon}
                </Box>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ backgroundColor: `${colors.primary}20` }} />

        {/* Language options */}
        <List sx={{ position: 'relative', zIndex: 1 }}>
          <ListItem>
            <Typography variant="subtitle2" sx={{
              color: darkMode ? `${colors.gray_bg}80` : 'white',
              fontWeight: 500,
            }}>
              {t('header.language') || 'Language'}
            </Typography>
          </ListItem>
          {languages.map((language) => (
            <ListItem key={language.code} disablePadding>
              <ListItemButton
                onClick={() => {
                  changeLanguage(language.code);
                  handleDrawerToggle();
                }}
                className="text-modern"
                sx={{
                  ...styles.drawerItem,
                  ...(i18n.language === language.code ? styles.activeDrawerItem : {}),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                    paddingLeft: '24px',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box component="span" sx={{ mr: 1 }}>{language.flag}</Box>
                  <ListItemText primary={language.label} />
                  {i18n.language === language.code && (
                    <Box component="span" sx={{ ml: 'auto', color: colors.primary }}>✓</Box>
                  )}
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ backgroundColor: `${colors.primary}20` }} />

        {/* Auth buttons */}
        <List sx={{ position: 'relative', zIndex: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/login"
              onClick={handleDrawerToggle}
              className="text-modern"
              sx={{
                ...styles.drawerItem,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: `${colors.primary}15`,
                  color: colors.primary,
                  paddingLeft: '24px',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiLogIn size={16} />
                <ListItemText primary={t('header.auth.login')} />
              </Box>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ p: 2 }}>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              fullWidth
              onClick={handleDrawerToggle}
              className="btn-primary text-modern"
              sx={{
                py: 1,
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary2})`,
                backgroundSize: '200% auto',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundPosition: 'right center',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.3)`,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                <FiUserPlus size={16} />
                {t('header.auth.signup')}
              </Box>
            </Button>
          </ListItem>
        </List>
      </Drawer>

      {/* Toolbar placeholder to prevent content from hiding behind the AppBar */}
      <Toolbar />
    </>
  );
}