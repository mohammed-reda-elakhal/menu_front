import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiGrid, FiPackage, FiEye, FiTrendingUp } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'

const Overview = () => {
  const { t } = useTranslation()

  // Fake data
  const fakeStats = {
    categoriesCount: 8,
    productsCount: 45,
    todayViews: 234,
    growthRate: '15%'
  }

  const fakeViewsData = [
    { date: 'Mon', views: 120 },
    { date: 'Tue', views: 180 },
    { date: 'Wed', views: 150 },
    { date: 'Thu', views: 270 },
    { date: 'Fri', views: 190 },
    { date: 'Sat', views: 320 },
    { date: 'Sun', views: 240 }
  ]

  const fakeBestProducts = [
    { id: 1, name: "Chicken Burger", category: "Burgers", price: 55, views: 156 },
    { id: 2, name: "Pizza Margherita", category: "Pizza", price: 89, views: 143 },
    { id: 3, name: "Caesar Salad", category: "Salads", price: 45, views: 98 },
    { id: 4, name: "Ice Cream Sundae", category: "Desserts", price: 35, views: 87 }
  ]

  const [stats, setStats] = useState(fakeStats)
  const [viewsData, setViewsData] = useState(fakeViewsData)
  const [bestProducts, setBestProducts] = useState(fakeBestProducts)

  useEffect(() => {
    // Simulate data loading
    setStats(fakeStats)
    setViewsData(fakeViewsData)
    setBestProducts(fakeBestProducts)
  }, [])

  const statsCards = [
    {
      title: t('dashboard.overview.stats.totalCategories'),
      value: stats.categoriesCount,
      change: `+2 ${t('dashboard.overview.stats.thisWeek')}`,
      icon: FiGrid,
      color: "primary"
    },
    {
      title: t('dashboard.overview.stats.totalProducts'),
      value: stats.productsCount,
      change: `+5 ${t('dashboard.overview.stats.thisWeek')}`,
      icon: FiPackage,
      color: "primary"
    },
    {
      title: t('dashboard.overview.stats.todayViews'),
      value: stats.todayViews,
      change: "+12.3%",
      icon: FiEye,
      color: "primary"
    },
    {
      title: t('dashboard.overview.stats.growthRate'),
      value: stats.growthRate,
      change: "+2.1%",
      icon: FiTrendingUp,
      color: "primary"
    }
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-secondary1/50 backdrop-blur-sm rounded-xl p-4 border border-primary/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray_bg text-sm">{stat.title}</p>
                <h4 className="text-white text-2xl font-bold mt-2">{stat.value}</h4>
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                <stat.icon className={`text-${stat.color} text-xl`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Best Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-secondary1/50 backdrop-blur-sm rounded-xl p-4 border border-primary/20"
        >
          <h3 className="text-white font-semibold mb-4">
            {t('dashboard.overview.charts.menuViews')}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#e7e7e7" />
                <YAxis stroke="#e7e7e7" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#01021b', 
                    border: '1px solid #3768e520',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="views" fill="#3768e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Best Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-secondary1/50 backdrop-blur-sm rounded-xl p-4 border border-primary/20"
        >
          <h3 className="text-white font-semibold mb-4">
            {t('dashboard.overview.charts.bestProducts')}
          </h3>
          <div className="space-y-4">
            {Array.isArray(bestProducts) && bestProducts.length > 0 ? (
              bestProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 bg-secondary1/30 rounded-lg border border-primary/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray_bg text-sm">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-medium">{product.price} MAD</p>
                      <p className="text-xs text-gray_bg">{product.views} views</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray_bg text-center py-4">
                {t('dashboard.overview.charts.noProducts')}
              </p>
            )}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-primary hover:text-white border border-primary/20 hover:bg-primary/20 rounded-lg transition-colors">
            {t('dashboard.overview.charts.viewAll')}
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Overview
