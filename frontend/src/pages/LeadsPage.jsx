"use client"

import { useState, useEffect } from "react"
import { leadAPI } from "../services/api"
import LeadForm from "../components/LeadForm"
import LeadKanban from "../components/LeadKanban"
import LeadList from "../components/LeadList"

const LeadsPage = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("kanban") // 'kanban' or 'list'
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const data = await leadAPI.getAll()
      setLeads(data)
    } catch (err) {
      setError("Failed to fetch leads")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLead = async (leadData) => {
    try {
      await leadAPI.create(leadData)
      await fetchLeads()
      setShowForm(false)
    } catch (err) {
      console.error("Failed to create lead:", err)
    }
  }

  const handleUpdateLead = async (id, leadData) => {
    try {
      await leadAPI.update(id, leadData)
      await fetchLeads()
      setEditingLead(null)
    } catch (err) {
      console.error("Failed to update lead:", err)
    }
  }

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await leadAPI.delete(id)
        await fetchLeads()
      } catch (err) {
        console.error("Failed to delete lead:", err)
      }
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
        <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
        <div className="flex space-x-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === "kanban"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === "list"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Lead
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {viewMode === "kanban" ? (
        <LeadKanban
          leads={leads}
          onUpdateLead={handleUpdateLead}
          onDeleteLead={handleDeleteLead}
          onEditLead={setEditingLead}
        />
      ) : (
        <LeadList
          leads={leads}
          onUpdateLead={handleUpdateLead}
          onDeleteLead={handleDeleteLead}
          onEditLead={setEditingLead}
        />
      )}

      {(showForm || editingLead) && (
        <LeadForm
          lead={editingLead}
          onSubmit={editingLead ? (data) => handleUpdateLead(editingLead.id, data) : handleCreateLead}
          onCancel={() => {
            setShowForm(false)
            setEditingLead(null)
          }}
        />
      )}
    </div>
  )
}

export default LeadsPage
