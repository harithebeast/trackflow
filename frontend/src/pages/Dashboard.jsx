"use client"

import { useState, useEffect } from "react"
import { dashboardAPI } from "../services/api"
import StatsCards from "../components/StatsCards"
import ChartsSection from "../components/ChartsSection"
import UpcomingFollowUps from "../components/UpcomingFollowUps"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    openLeads: 0,
    totalOrders: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats()
        setStats(data)
      } catch (err) {
        setError("Failed to fetch dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  const stats_cards = [
    { name: 'Total Leads', value: stats.totalLeads },
    { name: 'Open Leads', value: stats.openLeads },
    { name: 'Total Orders', value: stats.totalOrders },
    { name: 'Pending Orders', value: stats.pendingOrders },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats_cards.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg p-5">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.value}
            </dd>
          </div>
        ))}
      </div>

      <StatsCards stats={stats} />
      <ChartsSection stats={stats} />
      <UpcomingFollowUps leads={stats?.leads_due_this_week || []} />
    </div>
  )
}

export default Dashboard
