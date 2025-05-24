"use client"

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const stages = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"]

const LeadKanban = () => {
  const [leads, setLeads] = useState({});

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/leads/');
      const leadsByStage = stages.reduce((acc, stage) => {
        acc[stage] = response.data.filter(lead => lead.stage === stage);
        return acc;
      }, {});
      setLeads(leadsByStage);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newLeads = { ...leads };
    const [movedLead] = newLeads[source.droppableId].splice(source.index, 1);
    newLeads[destination.droppableId].splice(destination.index, 0, movedLead);
    setLeads(newLeads);

    try {
      await axios.put(`http://localhost:8000/api/leads/${draggableId}`, {
        stage: destination.droppableId
      });
    } catch (error) {
      console.error('Error updating lead stage:', error);
      fetchLeads(); // Revert changes if update fails
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      New: "border-blue-200 bg-blue-50",
      Contacted: "border-yellow-200 bg-yellow-50",
      Qualified: "border-green-200 bg-green-50",
      "Proposal Sent": "border-purple-200 bg-purple-50",
      Won: "border-green-200 bg-green-50",
      Lost: "border-red-200 bg-red-50",
    }
    return colors[stage] || "border-gray-200 bg-gray-50"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {stages.map(stage => (
          <div key={stage} className="flex-1 min-w-[300px]">
            <h3 className="text-lg font-semibold mb-2">{stage}</h3>
            <Droppable droppableId={stage}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-2 rounded-lg min-h-[500px]"
                >
                  {leads[stage]?.map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 mb-2 rounded shadow"
                        >
                          <h4 className="font-medium">{lead.name}</h4>
                          <p className="text-sm text-gray-600">{lead.company}</p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                {lead.follow_up_date && (
                            <p className="text-xs text-blue-600 mt-2">
                              Follow-up: {new Date(lead.follow_up_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
              </div>
              )}
            </Droppable>
        </div>
      ))}
    </div>
    </DragDropContext>
  )
}

export default LeadKanban
