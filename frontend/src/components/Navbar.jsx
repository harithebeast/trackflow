import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">TrackFlow</h1>
            <span className="text-gray-500">CRM</span>
          </div>

          <div className="flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/leads"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/leads") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Leads
            </Link>
            <Link
              to="/orders"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/orders") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Orders
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
