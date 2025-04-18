import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

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
import logo  from '../assets/menu.png'

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
  const { t, i18n } = useTranslation();

  const navigation = [
    { name: t('header.navigation.home'), href: '/' },
    { name: t('header.navigation.eatNow'), href: '#' },
    { name: t('header.navigation.marketplace'), href: '/marketplace' },
    { name: t('header.navigation.company'), href: '#' },
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
      // Using the gradient and glass effect classes from Tailwind
      background: 'none', // Remove default background
      boxShadow: 'none', // Remove default shadow
      minHeight: { xs: '56px', sm: '60px' }, // Smaller height on all devices
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      minHeight: { xs: '60px', sm: '64px' }, // Slightly taller for better spacing
      padding: { xs: '0 4px', sm: '0 16px' }, // Adjusted padding for mobile
      gap: { xs: '8px', sm: '16px' }, // Add gap between elements
    },
    logo: {
      height: { xs: '30px', sm: '32px' }, // Slightly larger on mobile for better visibility
      margin: { xs: '0 auto', sm: '0 8px 0 0' }, // Centered on mobile, normal margin on larger screens
    },
    menuButton: {
      color: colors.gray_bg,
      marginLeft: '4px', // Add left margin for spacing from edge
      display: { xs: 'flex', md: 'none' }, // Show only on mobile, not on tablet
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: `${colors.primary}20`,
      },
    },
    navMenu: {
      display: { xs: 'block', lg: 'none' }, // Show on mobile and tablet
    },
    navItem: {
      my: 1.5, // Reduced vertical margin
      color: colors.gray_bg,
      display: 'block',
      fontWeight: 500, // Slightly reduced font weight
      fontSize: '0.8rem', // Smaller font size
      textTransform: 'none',
      mx: 0.75, // Reduced horizontal margin
      '&:hover': {
        color: colors.primary,
      },
    },
    desktopMenu: {
      flexGrow: 1,
      display: { xs: 'none', lg: 'flex' }, // Only show on desktop
      justifyContent: 'center',
    },
    authButtons: {
      display: { xs: 'none', lg: 'flex' }, // Only show on desktop
      alignItems: 'center',
    },
    loginButton: {
      color: colors.gray_bg,
      textTransform: 'none',
      fontWeight: 500, // Reduced font weight
      fontSize: '0.8rem', // Smaller font size
      mx: 0.75, // Reduced margin
      minWidth: 'auto', // Allow button to shrink
      padding: '6px 8px', // Smaller padding
      '&:hover': {
        color: colors.primary,
        backgroundColor: 'transparent',
      },
    },
    signupButton: {
      backgroundColor: colors.primary,
      color: 'white',
      textTransform: 'none',
      fontWeight: 500, // Reduced font weight
      fontSize: '0.8rem', // Smaller font size
      borderRadius: '6px', // Slightly smaller border radius
      px: 2, // Reduced horizontal padding
      py: 0.75, // Reduced vertical padding
      mx: 0.75, // Reduced margin
      minWidth: 'auto', // Allow button to shrink
      '&:hover': {
        backgroundColor: colors.secondary2,
      },
    },
    langButton: {
      color: colors.gray_bg,
      backgroundColor: { xs: `${colors.primary}15`, md: colors.secondary1 }, // Lighter background on mobile
      border: `1px solid ${colors.primary}20`,
      borderRadius: '8px', // Larger border radius for better touch target
      padding: { xs: '6px 10px', md: '4px 8px' }, // Larger padding on mobile
      display: 'flex',
      alignItems: 'center',
      fontSize: { xs: '0.85rem', md: '0.75rem' }, // Larger font on mobile
      fontWeight: 500,
      minWidth: { xs: '40px', md: 'auto' }, // Fixed width on mobile
      minHeight: { xs: '36px', md: '32px' }, // Taller on mobile
      marginRight: { xs: '4px', md: '0' }, // Add right margin on mobile
      '& .MuiButton-endIcon': {
        marginLeft: 4,
      },
      '&:hover': {
        backgroundColor: `${colors.primary}25`,
      },
    },
    langMenu: {
      mt: '35px', // Reduced margin top
    },
    langMenuItem: {
      minWidth: 120, // Smaller width
      display: 'flex',
      alignItems: 'center',
      gap: 0.5, // Smaller gap
      fontSize: '0.75rem', // Smaller font size
      padding: '6px 10px', // Smaller padding
    },
    drawer: {
      width: { xs: 240, sm: 260 }, // Smaller width on mobile, slightly larger on tablet
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: { xs: 240, sm: 260 }, // Smaller width on mobile, slightly larger on tablet
        backgroundColor: colors.secondary1,
        color: colors.gray_bg,
        boxSizing: 'border-box',
      },
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px', // Smaller padding
      minHeight: '48px', // Smaller height
    },
    drawerItem: {
      color: colors.gray_bg,
      padding: '6px 16px', // Smaller padding
      minHeight: '40px', // Smaller height
      '& .MuiListItemText-primary': {
        fontSize: '0.85rem', // Smaller font size
      },
      '&:hover': {
        backgroundColor: `${colors.primary}20`,
        color: colors.primary,
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
          sx={styles.appBar}
          className="header-gradient glass-effect"
        >
          <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Toolbar disableGutters sx={styles.toolbar}>
              {/* Mobile menu icon - positioned on the left */}
              <IconButton
                size="small"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                sx={{
                  color: colors.gray_bg,
                  display: { xs: 'flex', md: 'none' },
                  padding: { xs: '8px', sm: '10px' },
                  marginRight: '8px',
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
                  <Box component="img" src={logo} alt="Logo" sx={styles.logo} />
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
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>

              {/* Auth buttons and language selector - desktop and tablet */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Show auth buttons on desktop and tablet (md and up) */}
                <Box sx={{
                  ...styles.authButtons,
                  // Override to show on tablet as well
                  display: { xs: 'none', md: 'flex', lg: 'flex' },
                }}>
                  <Button
                    component={Link}
                    to="/login"
                    className="btn-outline text-modern"
                    sx={{
                      minWidth: 'auto',
                      // Special handling for tablet
                      fontSize: { md: '0.75rem', lg: '0.8rem' },
                      mx: { md: 0.5, lg: 0.75 },
                    }}
                  >
                    {t('header.auth.login')}
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    className="btn-primary text-modern"
                    sx={{
                      minWidth: 'auto',
                      // Special handling for tablet
                      fontSize: { md: '0.75rem', lg: '0.8rem' },
                      mx: { md: 0.5, lg: 0.75 },
                    }}
                  >
                    {t('header.auth.signup')}
                  </Button>
                </Box>

                {/* Language selector - repositioned for mobile */}
                <Box sx={{
                  ml: { xs: 0, md: 1, lg: 1.5 },
                  display: 'flex',
                  justifyContent: 'flex-end',
                  minWidth: { xs: '50px', md: 'auto' }
                }}>
                  <Tooltip title="Change language">
                    <Button
                      onClick={handleOpenLangMenu}
                      className="text-modern"
                      sx={{
                        ...styles.langButton,
                        padding: { xs: '8px 10px', md: '4px 8px' },
                        minWidth: { xs: '40px', md: 'auto' },
                        borderRadius: '8px',
                      }}
                      endIcon={<KeyboardArrowDownIcon sx={{ display: { xs: 'none', md: 'flex' } }} fontSize="small" />}
                    >
                      <Box component="span" sx={{
                        mr: { xs: 0, md: 0.5 },
                        fontSize: { xs: '1.2rem', md: '1rem' }
                      }}>
                        {languages.find(lang => lang.code === i18n.language)?.flag || '🌐'}
                      </Box>
                      {/* Only show text on desktop, not on tablet or mobile */}
                      <Box component="span" sx={{ display: { xs: 'none', lg: 'block' } }}>
                        {languages.find(lang => lang.code === i18n.language)?.label || 'Language'}
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
                          '&:hover': {
                            backgroundColor: `${colors.primary}20`,
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
          display: { xs: 'block', md: 'none' }, // Only show on mobile, not on tablet
        }}
      >
        <Box sx={styles.drawerHeader}>
          <Box component="img" src={logo} alt="Logo" sx={{ height: '32px' }} />
          <IconButton onClick={handleDrawerToggle} sx={{ color: colors.gray_bg }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: `${colors.primary}20` }} />

        {/* Navigation items */}
        <List>
          {navigation.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                to={item.href}
                onClick={handleDrawerToggle}
                className="text-modern"
                sx={styles.drawerItem}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ backgroundColor: `${colors.primary}20` }} />

        {/* Language options */}
        <List>
          <ListItem>
            <Typography variant="subtitle2" sx={{ color: `${colors.gray_bg}80` }}>
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
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/login"
              onClick={handleDrawerToggle}
              className="text-modern"
              sx={styles.drawerItem}
            >
              <ListItemText primary={t('header.auth.login')} />
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
              }}
            >
              {t('header.auth.signup')}
            </Button>
          </ListItem>
        </List>
      </Drawer>

      {/* Toolbar placeholder to prevent content from hiding behind the AppBar */}
      <Toolbar />
    </>
  );
}
