import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import type { RangeId } from './data/metrics'
import { Finance } from './pages/Finance'
import { Landing } from './pages/Landing'
import { Marketing } from './pages/Marketing'
import { Sales } from './pages/Sales'

export default function App() {
  const [period, setPeriod] = useState<RangeId>('12m')

  return (
    <Routes>
      <Route element={<Layout period={period} onPeriodChange={setPeriod} />}>
        <Route index element={<Landing />} />
        <Route path="sales" element={<Sales />} />
        <Route path="finance" element={<Finance />} />
        <Route path="marketing" element={<Marketing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
