import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Drawer, Box, List, Divider, IconButton, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiBriefcase
} from 'react-icons/fi';
import logo from '../../assets/menu.png';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { MdOutlineMenuBook } from 'react-icons/md';

const drawerWidth = 260;

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openSubmenu, setOpenSubmenu] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { darkMode } = useCustomTheme();

  const menuItems = [
    {
      name: t('dashboard.sidebar.overview'),
      icon: FiHome,
      path: '/dashboard'
    },
    {
      name: t('dashboard.sidebar.menuSettings'),
      icon: MdOutlineMenuBook,
      path: '/dashboard/menu-settings'
    },
    {
      name: t('dashboard.sidebar.analytics'),
      icon: FiPieChart,
      path: '/dashboard/analytics'
    },
    {
      name: t('dashboard.sidebar.products'),
      icon: FiBriefcase,
      submenu: true,
      id: 'products',
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
        }
      ]
    },
    {
      name: t('dashboard.sidebar.menus'),
      icon: FiGrid,
      submenu: true,
      id: 'menus',
      items: [
        {
          name: t('dashboard.sidebar.menuList'),
          icon: FiList,
          path: '/dashboard/menus/list'
        },
        {
          name: t('dashboard.sidebar.createMenu'),
          icon: FiPlusSquare,
          path: '/dashboard/menus/create'
        }
      ]
    },
    {
      name: t('dashboard.sidebar.customers'),
      icon: FiUsers,
      path: '/dashboard/customers'
    },

  ];

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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-3 py-2.5 rounded-lg cursor-pointer
            transition-colors duration-200 group relative
            ${isActive || isSubmenuOpen
              ? 'bg-primary/20 text-primary'
              : 'text-gray_bg hover:bg-primary/10'}`}
          onClick={handleClick}
        >
          <Icon className={`text-xl ${isActive || isSubmenuOpen ? 'text-primary' : 'text-gray_bg group-hover:text-primary'}`} />
          {isOpen && (
            <motion.div className="flex items-center justify-between flex-1">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                {item.name}
              </motion.span>
              {hasSubmenu && (
                <motion.div
                  animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown className="text-lg" />
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
                className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20"
              >
                {item.items.map((subItem) => (
                  <motion.div
                    key={subItem.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                      transition-colors duration-200 group
                      ${location.pathname === subItem.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray_bg hover:bg-primary/5'}`}
                    onClick={() => navigate(subItem.path)}
                  >
                    <subItem.icon className={`text-lg ${location.pathname === subItem.path ? 'text-primary' : 'text-gray_bg group-hover:text-primary'}`} />
                    <span className="text-sm font-medium">{subItem.name}</span>
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
    <div className="flex flex-col h-full bg-secondary1">
      {/* Header - Center logo when closed */}
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-4`}>
        <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
          <img src={logo} alt="Logo" className="h-8 w-8" />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-white"
            >
              Meniwi
            </motion.span>
          )}
        </div>
      </div>

      <Divider className="border-primary/10" />

      {/* Main Menu */}
      <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} />
        ))}
      </div>

      {/* Bottom Menu */}
      <div className="p-3 space-y-2 border-t border-primary/10">
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
          className: "w-[260px] border-r border-primary/20 bg-secondary1"
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        className="hidden lg:block"
        PaperProps={{
          className: `border-r border-primary/20 overflow-hidden transition-all duration-300
            ${isOpen ? 'w-[260px]' : 'w-[80px]'} bg-secondary1`
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;