import React, { useState, useEffect } from 'react';
import { leadAPI } from '../services/api';
import LeadForm from '../components/LeadForm'; // Assuming you have a LeadForm component

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadAPI.getAll();
      setLeads(data);
    } catch (err) {
      setError(err);
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeadClick = () => {
    setSelectedLead(null);
    setShowLeadForm(true);
  };

  const handleEditLeadClick = (lead) => {
    setSelectedLead(lead);
    setShowLeadForm(true);
  };

  const handleDeleteLeadClick = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.delete(leadId);
        fetchLeads(); // Refresh list after deletion
      } catch (error) {
        console.error('Error deleting lead:', error);
        // TODO: Display user-friendly error message
      }
    }
  };

  const handleLeadFormSuccess = () => {
    fetchLeads(); // Refresh leads after creation/update
  };

  const handleLeadFormClose = () => {
    setShowLeadForm(false);
    setSelectedLead(null);
  };

  if (loading) return <div className="text-gray-900">Loading leads...</div>;
  if (error) return <div className="text-red-500">Error loading leads: {error.message}</div>;

  return (
    <div className="container mx-auto p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Leads</h1>

      <button
        onClick={handleCreateLeadClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-700"
      >
        Add New Lead
      </button>

      {/* Vertical Table Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.length === 0 ? (
          <p>No leads found.</p>
        ) : (
          leads.map(lead => (
            <div key={lead.id} className="bg-white rounded-lg shadow p-4 space-y-2">
              <div>
                <span className="font-semibold">Name:</span> {lead.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {lead.email}
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {lead.phone}
              </div>
              <div>
                <span className="font-semibold">Company:</span> {lead.company}
              </div>
              <div>
                <span className="font-semibold">Source:</span> {lead.source}
              </div>
              <div>
                <span className="font-semibold">Stage:</span> {lead.stage}
              </div>
               {/* Add other lead fields here */}
              {lead.product_interest && (
                <div>
                   <span className="font-semibold">Product Interest:</span> {lead.product_interest}
                 </div>
              )}
              {lead.notes && (
                <div>
                  <span className="font-semibold">Notes:</span> {lead.notes}
                </div>
              )}
               {lead.follow_up_date && (
                 <div>
                   <span className="font-semibold">Follow-up Date:</span>{' '}
                   {new Date(lead.follow_up_date).toLocaleDateString()}
                 </div>
               )}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleEditLeadClick(lead)}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLeadClick(lead.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <LeadForm
          lead={selectedLead}
          onSuccess={handleLeadFormSuccess}
          onClose={handleLeadFormClose}
        />
      )}
    </div>
  );
};

export default Leads; 