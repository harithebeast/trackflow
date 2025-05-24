import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { orderAPI } from '../services/api';
import OrderForm from './OrderForm'; // Make sure this path is correct

const orderStages = ['Order Received', 'In Development', 'Ready to Dispatch', 'Dispatched'];

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getAll();
      setOrders(data);
    } catch (err) {
      setError(err);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.update(orderId, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDispatchUpdate = async (orderId, dispatchData) => {
    try {
      await orderAPI.update(orderId, dispatchData);
      fetchOrders();
    } catch (error) {
      console.error('Error updating dispatch details:', error);
    }
  };

  const handleCreateOrderClick = () => {
    setSelectedOrder(null);
    setShowOrderForm(true);
  };

  const handleEditOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderForm(true);
  };

  const handleDeleteOrderClick = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderAPI.delete(orderId);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleOrderFormSuccess = () => {
    fetchOrders();
  };

  const handleOrderFormClose = () => {
    setShowOrderForm(false);
    setSelectedOrder(null);
  };

  if (loading) return <div className="text-gray-900">Loading orders...</div>;
  if (error) return <div className="text-red-500">Error loading orders: {error.message}</div>;

  return (
    <div className="p-4 text-gray-900">
      <h2 className="text-2xl font-bold mb-6">Order Tracking</h2>

      <button
        onClick={handleCreateOrderClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-700"
      >
        Add New Order
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Orders</h3>
          <div className="space-y-4">
            {orders.length === 0 ? (
               <p>No orders found.</p>
            ) : (
              orders.map(order => (
                <div
                  key={order.id}
                  className={`p-4 rounded-lg border cursor-pointer ${
                    selectedOrder?.id === order.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Order #{order.id.slice(0, 8)}</h4>
                      <p className="text-sm text-gray-600">Status: {order.status}</p>
                      <button
                         onClick={(e) => {
                           e.stopPropagation();
                           handleEditOrderClick(order);
                         }}
                         className="ml-4 text-blue-600 hover:text-blue-900 text-sm"
                       >
                         Edit
                       </button>
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           handleDeleteOrderClick(order.id);
                         }}
                         className="ml-2 text-red-600 hover:text-red-900 text-sm"
                       >
                         Delete
                       </button>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'Dispatched' ? 'bg-green-100 text-green-800' :
                      order.status === 'Ready to Dispatch' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'In Development' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {orderStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              {selectedOrder.status === 'Ready to Dispatch' && (
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Dispatch Details
                </button>
              )}

              {selectedOrder.status === 'Dispatched' && (
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Courier:</span> {selectedOrder.courier}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Tracking Number:</span> {selectedOrder.tracking_number}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Dispatch Date:</span>{' '}
                    {selectedOrder.dispatch_date ? new Date(selectedOrder.dispatch_date).toLocaleDateString() : '-'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          order={selectedOrder}
          onSuccess={handleOrderFormSuccess}
          onClose={handleOrderFormClose}
        />
      )}
    </div>
  );
};

export default OrderTracking; 