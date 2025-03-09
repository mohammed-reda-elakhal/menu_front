import React from 'react'
import { useTranslation } from 'react-i18next'

const Supplements = () => {
  const { t } = useTranslation()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">
        {t('dashboard.products.supplements.title')}
      </h1>
    </div>
  )
}

export default Supplements
