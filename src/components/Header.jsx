'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import logo from '../assets/menu.png'
import { Link } from 'react-router-dom'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Eat Now', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#01021b]"
    >
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8 bg-[#01021b]/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex lg:flex-1"
          >
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="" src={logo} className="h-10 w-auto" />
            </a>
          </motion.div>
          
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#e7e7e7]"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-sm font-semibold text-[#e7e7e7] hover:text-[#3768e5] transition-colors duration-300"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-center items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/login"
                className="text-sm font-semibold text-[#e7e7e7] hover:text-[#3768e5] transition-colors duration-300 px-4 py-2"
              >
                Log in
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/signup"
                className="text-sm font-semibold px-6 py-2 bg-[#3768e5] text-white rounded-lg hover:bg-[#757de8] transition-colors duration-300"
              >
                Sign up
              </Link>
            </motion.div>
          </div>
        </nav>

        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#01021b] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img alt="" src={logo} className="h-8 w-auto" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-[#e7e7e7]"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-[#e7e7e7] hover:bg-[#3768e5]/10 hover:text-[#3768e5] transition-colors duration-300"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6 space-y-2">
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-[#e7e7e7] hover:bg-[#3768e5]/10 hover:text-[#3768e5] transition-colors duration-300"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold bg-[#3768e5] text-white text-center hover:bg-[#757de8] transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </motion.div>
  )
}
