"use client"

import { useState } from "react"

const OrderList = ({ orders, onUpdateOrder }) => {
  const [filterStatus, setFilterStatus] = useState("")
  const [editingOrder, setEditingOrder] = useState(null)

  const statuses = ["Order Received", "In Development", "Ready to Dispatch", "Dispatched"]

  const filteredOrders = orders.filter((order) => !filterStatus || order.status === filterStatus)

  const getStatusColor = (status) => {
    const colors = {
      "Order Received": "bg-blue-100 text-blue-800",
      "In Development": "bg-yellow-100 text-yellow-800",
      "Ready to Dispatch": "bg-orange-100 text-orange-800",
      Dispatched: "bg-green-100 text-green-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "-"
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      await onUpdateOrder(orderId, { ...order, status: newStatus })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dispatch Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {order.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Lead ID: {order.lead_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(order.dispatch_date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.courier || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.tracking_number || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => setEditingOrder(order)} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingOrder && (
        <OrderEditForm
          order={editingOrder}
          onSubmit={(data) => {
            onUpdateOrder(editingOrder.id, data)
            setEditingOrder(null)
          }}
          onCancel={() => setEditingOrder(null)}
        />
      )}
    </div>
  )
}

const OrderEditForm = ({ order, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    status: order.status,
    dispatch_date: order.dispatch_date || "",
    courier: order.courier || "",
    tracking_number: order.tracking_number || "",
  })

  const statuses = ["Order Received", "In Development", "Ready to Dispatch", "Dispatched"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Order</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dispatch Date</label>
              <input
                type="date"
                name="dispatch_date"
                value={formData.dispatch_date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Courier</label>
              <input
                type="text"
                name="courier"
                value={formData.courier}
                onChange={handleChange}
                placeholder="e.g., FedEx, UPS, DHL"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
              <input
                type="text"
                name="tracking_number"
                value={formData.tracking_number}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OrderList
