"use client"

import { useState, useEffect } from "react"
import { orderAPI } from "../services/api"
import OrderList from "../components/OrderList"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderAPI.getAll()
      setOrders(data)
    } catch (err) {
      setError("Failed to fetch orders")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrder = async (id, orderData) => {
    try {
      await orderAPI.update(id, orderData)
      await fetchOrders()
    } catch (err) {
      console.error("Failed to update order:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <div className="text-sm text-gray-500">Total Orders: {orders.length}</div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <OrderList orders={orders} onUpdateOrder={handleUpdateOrder} />
    </div>
  )
}

export default OrdersPage
