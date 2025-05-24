"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

const ChartsSection = ({ stats }) => {
  const ordersChartRef = useRef(null)
  const ordersChartInstance = useRef(null)

  useEffect(() => {
    if (stats?.orders_by_status && ordersChartRef.current) {
      // Destroy existing chart
      if (ordersChartInstance.current) {
        ordersChartInstance.current.destroy()
      }

      const ctx = ordersChartRef.current.getContext("2d")
      const orderStatuses = Object.keys(stats.orders_by_status)
      const orderCounts = Object.values(stats.orders_by_status)

      ordersChartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: orderStatuses,
          datasets: [
            {
              data: orderCounts,
              backgroundColor: [
                "#3B82F6", // blue
                "#EF4444", // red
                "#F59E0B", // amber
                "#10B981", // green
              ],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
            title: {
              display: true,
              text: "Orders by Status",
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
        },
      })
    }

    return () => {
      if (ordersChartInstance.current) {
        ordersChartInstance.current.destroy()
      }
    }
  }, [stats])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Orders Distribution</h3>
        <div className="relative h-64">
          <canvas ref={ordersChartRef}></canvas>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Add New Lead
          </button>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
            View All Orders
          </button>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChartsSection
