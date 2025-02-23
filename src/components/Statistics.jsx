import React from 'react'
import { motion } from 'framer-motion'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Statistics = () => {
  // Sample data for 2025
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'With Menuso',
        data: [15000, 16800, 18500, 21000, 23500, 25800, 28000, 30500, 33000, 35500, 38000, 41000],
        borderColor: '#3768e5',
        backgroundColor: 'rgba(55, 104, 229, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Without Menuso',
        data: [15000, 15200, 15800, 16000, 16200, 16500, 16800, 17000, 17200, 17500, 17800, 18000],
        borderColor: '#757de8',
        backgroundColor: 'rgba(117, 125, 232, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  }

  const statisticsData = [
    { label: 'Average Order Value', withMenuso: '+25%', withoutMenuso: 'Baseline' },
    { label: 'Customer Satisfaction', withMenuso: '95%', withoutMenuso: '75%' },
    { label: 'Menu Updates Speed', withMenuso: '< 1 minute', withoutMenuso: '1-2 days' },
    { label: 'Order Accuracy', withMenuso: '99%', withoutMenuso: '85%' },
  ]

  return (
    <div className="bg-secondary1 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Transform Your Restaurant's <span className="text-primary">Performance</span>
          </h2>
          <p className="text-gray_bg text-lg max-w-2xl mx-auto">
            See how restaurants using Menuso outperform traditional menu systems in 2025
          </p>
        </motion.div>

        {/* Revenue Graph */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-secondary1 p-6 rounded-2xl border border-primary/20 mb-12"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Monthly Revenue Comparison (2025)</h3>
          <div className="h-[400px]">
            <Line
              data={monthlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                      color: '#e7e7e7',
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                      color: '#e7e7e7',
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: '#e7e7e7'
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statisticsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-secondary1 p-6 rounded-xl border border-primary/20"
            >
              <h4 className="text-gray_bg text-sm mb-3">{stat.label}</h4>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-primary">{stat.withMenuso}</p>
                  <p className="text-sm text-gray_bg">With Menuso</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray_bg">{stat.withoutMenuso}</p>
                  <p className="text-sm text-gray_bg">Without Menuso</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-xl
              font-semibold hover:bg-secondary2 transition-colors duration-300"
          >
            Start Growing Your Business
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default Statistics