import { useState, Fragment } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import logo from '../assets/menu.png';

export default function Header() {
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navigation = [
    { name: t('header.navigation.home'), href: '/' },
    { name: t('header.navigation.eatNow'), href: '#' },
    { name: t('header.navigation.marketplace'), href: '/marketplace' },
    { name: t('header.navigation.company'), href: '#' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="bg-[#01021b]">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8 bg-[#01021b]/80 backdrop-blur-md">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <img alt="" src={logo} className="h-10 w-auto" />
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#e7e7e7]"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-semibold text-[#e7e7e7] hover:text-[#3768e5] transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-center items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-[#e7e7e7] hover:text-[#3768e5] transition-colors duration-300 px-4 py-2"
            >
              {t('header.auth.login')}
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold px-6 py-2 bg-[#3768e5] text-white rounded-lg hover:bg-[#757de8] transition-colors duration-300"
            >
              {t('header.auth.signup')}
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-x-4 mx-4">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-[#1a1b35] px-3 py-2 text-sm text-[#e7e7e7] shadow-sm hover:bg-[#2a2b45] transition-all duration-200">
                  {languages.find((lang) => lang.code === i18n.language)?.flag || '🌐'}
                  <span className="ml-2">{languages.find((lang) => lang.code === i18n.language)?.label || 'Language'}</span>
                  <ChevronDownIcon className="-mr-1 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-[#1a1b35] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {languages.map((language) => (
                      <Menu.Item key={language.code}>
                        {({ active }) => (
                          <button
                            onClick={() => changeLanguage(language.code)}
                            className={`${
                              active ? 'bg-[#2a2b45] text-[#3768e5]' : 'text-[#e7e7e7]'
                            } ${
                              i18n.language === language.code ? 'bg-[#2a2b45]' : ''
                            } group flex w-full items-center px-4 py-2 text-sm`}
                          >
                            <span className="mr-2">{language.flag}</span>
                            {language.label}
                            {i18n.language === language.code && (
                              <span className="ml-auto text-[#3768e5]">✓</span>
                            )}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </nav>

        <Dialog
          static
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#01021b] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <img alt="" src={logo} className="h-8 w-auto" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-[#e7e7e7]"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-[#e7e7e7] hover:bg-[#3768e5]/10 hover:text-[#3768e5] transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-2 py-4">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        changeLanguage(language.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center px-4 py-2 rounded-md text-sm ${
                        i18n.language === language.code
                          ? 'bg-[#2a2b45] text-[#3768e5]'
                          : 'text-[#e7e7e7] hover:bg-[#2a2b45] hover:text-[#3768e5]'
                      } transition-all duration-200`}
                    >
                      <span className="mr-2">{language.flag}</span>
                      {language.label}
                      {i18n.language === language.code && <span className="ml-auto">✓</span>}
                    </button>
                  ))}
                </div>
                <div className="py-6 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-[#e7e7e7] hover:bg-[#3768e5]/10 hover:text-[#3768e5] transition-colors duration-300"
                  >
                    {t('header.auth.login')}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold bg-[#3768e5] text-white text-center hover:bg-[#757de8] transition-colors duration-300"
                  >
                    {t('header.auth.signup')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </header>
    </div>
  );
}