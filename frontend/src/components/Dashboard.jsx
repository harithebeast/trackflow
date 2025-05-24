import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_leads: 0,
    leads_by_stage: {},
    total_orders: 0,
    orders_by_status: {},
    follow_ups_due: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Qualified': 'bg-purple-100 text-purple-800',
      'Proposal Sent': 'bg-orange-100 text-orange-800',
      'Won': 'bg-green-100 text-green-800',
      'Lost': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      'Order Received': 'bg-blue-100 text-blue-800',
      'In Development': 'bg-yellow-100 text-yellow-800',
      'Ready to Dispatch': 'bg-purple-100 text-purple-800',
      'Dispatched': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Leads</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total_leads}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-3xl font-bold text-green-600">{stats.total_orders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Follow-ups Due</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.follow_ups_due.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leads by Stage */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Leads by Stage</h3>
          <div className="space-y-3">
            {Object.entries(stats.leads_by_stage).map(([stage, count]) => (
              <div key={stage} className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${getStageColor(stage)}`}>
                  {stage}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {Object.entries(stats.orders_by_status).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${getOrderStatusColor(status)}`}>
                  {status}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-ups Due */}
      {stats.follow_ups_due.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Follow-ups Due This Week</h3>
          <div className="space-y-3">
            {stats.follow_ups_due.map(lead => (
              <div key={lead.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{lead.name}</h4>
                  <p className="text-sm text-gray-600">{lead.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-600">
                    Due: {new Date(lead.follow_up_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">Stage: {lead.stage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 