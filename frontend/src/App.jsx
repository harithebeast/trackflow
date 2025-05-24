import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeadKanban from './components/LeadKanban';
import LeadForm from './components/LeadForm';
import OrderTracking from './components/OrderTracking';
import Dashboard from './components/Dashboard';

// Layout
import Layout from './components/Layout';

// Pages
import DashboardPage from './pages/Dashboard';
import LeadsPage from './pages/Leads';
import OrdersPage from './pages/Orders';

const App = () => {
  const [isAddingLead, setIsAddingLead] = useState(false);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Layout>
        <div className="min-h-screen bg-gray-100">
          {/* Navigation */}
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-bold text-blue-600">TrackFlow CRM</h1>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      to="/"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/leads"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Leads
                    </Link>
                    <Link
                      to="/orders"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Orders
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route
                path="/leads"
                element={
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Leads</h2>
                      <button
                        onClick={() => setIsAddingLead(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Add Lead
                      </button>
                    </div>
                    {isAddingLead && (
                      <div className="mb-6">
                        <LeadForm onSuccess={() => setIsAddingLead(false)} />
                      </div>
                    )}
                    <LeadKanban />
                  </div>
                }
              />
              <Route path="/orders" element={<OrderTracking />} />
          </Routes>
        </main>
      </div>
      </Layout>
    </Router>
  );
};

export default App;
