"use client"

import React, { useState } from 'react';
import axios from 'axios';

const stages = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const LeadForm = ({ lead, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    company: lead?.company || '',
    source: lead?.source || 'Website',
    stage: lead?.stage || 'New',
    
    notes: lead?.notes || '',
    follow_up_date: lead?.follow_up_date ? new Date(lead.follow_up_date).toISOString().split('T')[0] : ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const dataToSend = { ...formData };
    // Convert empty follow_up_date string to null
    if (dataToSend.follow_up_date === '') {
      dataToSend.follow_up_date = null;
    } else if (dataToSend.follow_up_date) {
      // Format date to ISO 8601 datetime string
      dataToSend.follow_up_date = new Date(dataToSend.follow_up_date).toISOString();
    }

    // Remove product_interest as it's not in the backend schema
    delete dataToSend.product_interest;

    if (lead) {
        await axios.put(`http://localhost:8000/api/leads/${lead.id}`, dataToSend);
      } else {
        await axios.post('http://localhost:8000/api/leads/', dataToSend);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{lead ? "Edit Lead" : "Add New Lead"}</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                onChange={handleChange}
                required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Source</label>
                <select
                  name="source"
                  value={formData.source}
                onChange={handleChange}
                required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
              <input
                type="date"
                name="follow_up_date"
                value={formData.follow_up_date}
                onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {lead ? 'Update Lead' : 'Create Lead'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
