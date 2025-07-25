import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Drawer, Box, List, Divider, IconButton, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { LuLayoutTemplate } from "react-icons/lu";
import { BsFillMenuButtonFill } from "react-icons/bs";
import {
  FiHome,
  FiPieChart,
  FiMenu as MenuIcon,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiBell,
  FiChevronDown,
  FiList,
  FiPlusSquare,
  FiLayout,
  FiBriefcase,
  FiUser,
  FiShield
} from 'react-icons/fi';
import { FaBoxes } from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import { MdLocalGroceryStore } from "react-icons/md";
import logo from '../../assets/menu.png';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { MdOutlineMenuBook } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { GoProjectTemplate } from "react-icons/go";
import { FiImage } from "react-icons/fi";

const drawerWidth = 260;

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openSubmenu, setOpenSubmenu] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { darkMode } = useCustomTheme();

  // Get user from Redux
  const { user } = useSelector(state => state.auth);

  // Determine if user is admin for styling and menu filtering
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  // Define all menu items
  const allMenuItems = [
    {
      name: t('dashboard.sidebar.overview'),
      icon: FiHome,
      path: '/dashboard',
      roles: ['admin', 'client'] // Available for all users
    },
    {
      name: t('dashboard.sidebar.menuSettings'),
      icon: BsFillMenuButtonFill,
      path: '/dashboard/menu-settings',
      roles: ['client'] // Only for clients
    },
    {
      name: t('dashboard.sidebar.products'),
      icon: FaBoxes,
      submenu: true,
      id: 'products',
      roles: ['client'], // Only for clients
      items: [
        {
          name: t('dashboard.sidebar.categories'),
          icon: FiGrid,
          path: '/dashboard/products/categories'
        },
        {
          name: t('dashboard.sidebar.productsList'),
          icon: FiList,
          path: '/dashboard/products/list'
        },
        {
          name: t('dashboard.sidebar.supplements'),
          icon: FiPlusSquare,
          path: '/dashboard/products/supplements'
        },
        {
          name: t('dashboard.sidebar.exportMenu'),
          icon: FiImage,
          path: '/dashboard/export-menu',
        }
      ]
    },
    {
      name: t('dashboard.sidebar.theme'),
      icon: LuLayoutTemplate,
      submenu: true,
      id: 'theme',
      roles: ['admin', 'client'], // Mixed roles for submenu items
      items: [
        {
          name: t('dashboard.sidebar.ownerTheme'),
          icon: CiBoxList,
          path: '/dashboard/ownerTheme',
          roles: ['client'] // Only for clients
        },
        {
          name: t('dashboard.sidebar.marketplace'),
          icon: MdLocalGroceryStore,
          path: '/dashboard/Marketplace',
          roles: ['admin', 'client'] // Available for all users
        },
        {
          name: t('dashboard.sidebar.templateList'),
          icon: GoProjectTemplate,
          path: '/dashboard/templates',
          roles: ['admin'] // Only for admins
        },
      ]
    },
    {
      name: t('dashboard.sidebar.customers'),
      icon: FiUsers,
      path: '/dashboard/customers',
      roles: ['admin'] // Only for admins
    },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    // Check if the item is available for the user's role
    if (!item.roles.includes(user?.role)) {
      return false;
    }

    // For items with submenu, filter the submenu items
    if (item.submenu) {
      // Create a copy of the item with filtered submenu items
      const filteredItem = { ...item };
      filteredItem.items = item.items.filter(subItem =>
        !subItem.roles || subItem.roles.includes(user?.role)
      );

      // Only include the submenu if it has at least one item
      return filteredItem.items.length > 0;
    }

    return true;
  });

  const bottomItems = [
    {
      name: t('dashboard.sidebar.settings'),
      icon: FiSettings,
      path: '/dashboard/settings'
    },
    {
      name: t('dashboard.sidebar.help'),
      icon: FiHelpCircle,
      path: '/dashboard/help'
    }
  ];

  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const isSubmenuOpen = openSubmenu === item.id;
    const hasSubmenu = item.submenu;

    const handleClick = () => {
      if (hasSubmenu) {
        setOpenSubmenu(isSubmenuOpen ? '' : item.id);
      } else {
        navigate(item.path);
      }
    };

    return (
      <>
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center ${isOpen ? 'gap-2' : 'justify-center'} px-2 py-1.5 rounded-lg cursor-pointer
            transition-colors duration-200 group relative
            ${isActive || isSubmenuOpen
              ? darkMode
                ? 'bg-primary/20 text-primary'
                : 'bg-primary/10 text-primary'
              : darkMode
                ? 'text-gray-300 hover:bg-primary/10'
                : 'text-gray-700 hover:bg-primary/5'
            }`}
          onClick={handleClick}
        >
          <Icon className={`text-lg ${
            isActive || isSubmenuOpen
              ? 'text-primary'
              : darkMode
                ? 'text-gray-300 group-hover:text-primary'
                : 'text-gray-700 group-hover:text-primary'
          }`} />
          {isOpen && (
            <motion.div className="flex items-center justify-between flex-1">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xs font-medium whitespace-nowrap"
              >
                {item.name}
              </motion.span>
              {hasSubmenu && (
                <motion.div
                  animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown className="text-base" />
                </motion.div>
              )}
            </motion.div>
          )}
          {!isOpen && hasSubmenu && (
            <Tooltip title={item.name} placement="right">
              <span className="sr-only">{item.name}</span>
            </Tooltip>
          )}
        </motion.div>

        {/* Submenu */}
        {hasSubmenu && isOpen && (
          <AnimatePresence>
            {isSubmenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`ml-4 mt-1 space-y-1 border-l-2 ${
                  darkMode ? 'border-primary/20' : 'border-primary/30'
                }`}
              >
                {item.items.map((subItem) => (
                  <motion.div
                    key={subItem.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer
                      transition-colors duration-200 group
                      ${location.pathname === subItem.path
                        ? darkMode
                          ? 'bg-primary/10 text-primary'
                          : 'bg-primary/5 text-primary'
                        : darkMode
                          ? 'text-gray-300 hover:bg-primary/5'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => navigate(subItem.path)}
                  >
                    <subItem.icon className={`text-base ${
                      location.pathname === subItem.path
                        ? 'text-primary'
                        : darkMode
                          ? 'text-gray-300 group-hover:text-primary'
                          : 'text-gray-700 group-hover:text-primary'
                    }`} />
                    <span className="text-xs font-medium">{subItem.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </>
    );
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full ${
      darkMode
        ? isAdmin
          ? 'bg-gradient-to-b from-secondary1 via-[#0a1a4d] to-secondary1'
          : 'bg-secondary1'
        : isAdmin
          ? 'bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50'
          : 'bg-white'
    }`}>
      {/* Header - Center logo when closed */}
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-4`}>
        <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
          <img src={logo} alt="Logo" className="h-8 w-8" />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
            >
              Meniwi
            </motion.span>
          )}
        </div>
        {isAdmin && isOpen && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md border ${
            darkMode
              ? 'bg-primary/20 border-primary/30'
              : 'bg-primary/10 border-primary/20'
          }`}>
            <FiShield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Admin</span>
          </div>
        )}
      </div>

      <Divider className={`${
        darkMode
          ? isAdmin ? 'border-primary/20' : 'border-primary/10'
          : isAdmin ? 'border-primary/30' : 'border-gray-200'
      }`} />

      {/* Main Menu */}
      <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          // For submenu items, we need to filter the items based on user role
          if (item.submenu) {
            const filteredItem = { ...item };
            filteredItem.items = item.items.filter(subItem =>
              !subItem.roles || subItem.roles.includes(user?.role)
            );
            return <MenuItem key={item.id} item={filteredItem} />;
          }
          return <MenuItem key={item.path} item={item} />;
        })}
      </div>

      {/* Bottom Menu */}
      <div className={`p-3 space-y-2 border-t ${
        darkMode
          ? isAdmin ? 'border-primary/20' : 'border-primary/10'
          : isAdmin ? 'border-primary/30' : 'border-gray-200'
      }`}>
        {bottomItems.map((item) => (
          <MenuItem key={item.path} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ModalProps={{ keepMounted: true }}
        className="lg:hidden"
        PaperProps={{
          className: `w-[260px] border-r ${
            darkMode
              ? isAdmin
                ? 'border-primary/30 bg-gradient-to-b from-secondary1 via-[#0a1a4d] to-secondary1'
                : 'border-primary/20 bg-secondary1'
              : isAdmin
                ? 'border-primary/20 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50'
                : 'border-gray-200 bg-white'
          }`
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        className="hidden lg:block"
        PaperProps={{
          className: `border-r overflow-hidden transition-all duration-300
            ${isOpen ? 'w-[260px]' : 'w-[80px]'}
            ${darkMode
              ? isAdmin
                ? 'border-primary/30 bg-gradient-to-b from-secondary1 via-[#0a1a4d] to-secondary1'
                : 'border-primary/20 bg-secondary1'
              : isAdmin
                ? 'border-primary/20 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50'
                : 'border-gray-200 bg-white'
            }`
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;