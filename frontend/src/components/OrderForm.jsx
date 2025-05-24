import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { leadAPI } from '../services/api'; // Import leadAPI

const OrderForm = ({ order, leadId, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    lead_id: order?.lead_id || leadId || '',
    product_name: order?.product_name || '',
    quantity: order?.quantity || 1,
    status: order?.status || 'Order Received',
  });

  const [leads, setLeads] = useState([]); // State to store the list of leads
  const [loadingLeads, setLoadingLeads] = useState(true); // State to track loading of leads

  // Fetch leads to populate a dropdown if creating a new order
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoadingLeads(true); // Set loading to true before fetching
        const data = await leadAPI.getAll(); // Fetch all leads
        setLeads(data);
        // If creating a new order and no leadId is pre-selected, default to the first lead if available
        if (!order && !leadId && data.length > 0) {
          setFormData(prev => ({ ...prev, lead_id: data[0].id }));
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
        // TODO: Display user-friendly error message
      } finally {
        setLoadingLeads(false); // Set loading to false after fetching
      }
    };

    // Only fetch leads if creating a new order or if editing and the lead list is needed for context
    // For simplicity, fetching always when form is shown, but can be optimized.
     fetchLeads();
  }, [order, leadId]); // Depend on order and leadId

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      // Ensure quantity is a number
      dataToSend.quantity = parseInt(dataToSend.quantity, 10);

      if (order) {
        // Update existing order
        await axios.put(`http://localhost:8000/api/orders/${order.id}`, dataToSend);
      } else {
        // Create new order
        await axios.post('http://localhost:8000/api/orders/', dataToSend);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving order:', error);
      // TODO: Display user-friendly error message
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const orderStatuses = ['Order Received', 'In Development', 'Ready for Shipment', 'Shipped', 'Cancelled']; // Example statuses

  // Find the selected lead's name for display when editing
  const selectedLead = leads.find(lead => lead.id === formData.lead_id);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white text-gray-900">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{order ? "Edit Order" : "Add New Order"}</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Lead Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Associated Lead</label>
              {/* If editing an existing order, show the lead name, otherwise show dropdown */}
              {order ? (
                 <input
                   type="text"
                   value={selectedLead ? selectedLead.name : 'Loading...'}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                   disabled
                 />
              ) : (
                 <select
                  name="lead_id"
                  value={formData.lead_id}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {loadingLeads ? (
                     <option value="">Loading Leads...</option>
                  ) : leads.length === 0 ? (
                     <option value="">No Leads Available</option>
                  ) : (
                     leads.map(lead => (
                       <option key={lead.id} value={lead.id}>{lead.name}</option>
                     ))
                  )}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {orderStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {order ? 'Update Order' : 'Create Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm; 