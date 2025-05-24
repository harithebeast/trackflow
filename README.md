# TrackFlow CRM

A lightweight CRM and internal operations automation tool built with React and FastAPI.

## 🚀 Features

### Core Features (Part 1)
- **Lead Management**: Create, update, and track leads through different stages
- **Kanban View**: Visual pipeline management with drag-and-drop stages
- **List View**: Sortable and filterable lead list with advanced search
- **Order Management**: Automatic order creation from won leads
- **Dashboard**: Real-time analytics with Chart.js visualizations
- **Follow-up System**: Automated reminders for upcoming follow-ups

### Bonus Features (Part 2)
- **Automation Rules**: Auto-create orders when leads are marked "Won"
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-time Updates**: Live dashboard metrics
- **Status Tracking**: Order status updates with dispatch details

## 🏗️ Tech Stack

- **Frontend**: React 18, TailwindCSS, Chart.js, React Router
- **Backend**: FastAPI, SQLAlchemy ORM, PostgreSQL
- **Database**: PostgreSQL with UUID primary keys
- **Hosting**: Vercel (Frontend), Render (Backend)

## 📁 Project Structure

\`\`\`
trackflow/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── crud/           # Database operations
│   │   ├── api/            # FastAPI routes
│   │   ├── main.py         # Application entry point
│   │   ├── config.py       # Configuration settings
│   │   └── database.py     # Database connection
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API integration
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
├── .env.example
└── README.md
\`\`\`

## 🛠️ Local Development Setup

### Backend Setup

1. **Navigate to backend directory**:
   \`\`\`bash
   cd backend
   \`\`\`

2. **Create virtual environment**:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. **Install dependencies**:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Setup PostgreSQL database**:
   - Install PostgreSQL
   - Create a database named `trackflow`
   - Update connection string in `.env`

5. **Configure environment**:
   \`\`\`bash
   cp ../.env.example .env
   # Edit .env with your database credentials
   \`\`\`

6. **Run the application**:
   \`\`\`bash
   python -m app.main
   \`\`\`

7. **Create seed data** (optional):
   \`\`\`bash
   curl -X POST http://localhost:8000/api/seed-data
   \`\`\`

The backend will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment**:
   \`\`\`bash
   cp ../.env.example .env
   # Set REACT_APP_API_URL=http://localhost:8000/api
   \`\`\`

4. **Start development server**:
   \`\`\`bash
   npm start
   \`\`\`

The frontend will be available at `http://localhost:3000`

## 🌐 Deployment

### Backend Deployment (Render)

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure the service**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `SECRET_KEY`: A secure secret key

### Frontend Deployment (Vercel)

1. **Connect your GitHub repository to Vercel**
2. **Configure the project**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: Your Render backend URL + `/api`

## 🧪 Testing

### API Testing

Use the provided `test_api.http` file with REST Client extension in VS Code:

1. **Install REST Client extension**
2. **Open `test_api.http`**
3. **Click "Send Request" above each endpoint**

### Sample API Calls

\`\`\`bash
# Create seed data
curl -X POST http://localhost:8000/api/seed-data

# Get all leads
curl http://localhost:8000/api/leads

# Create a lead
curl -X POST http://localhost:8000/api/leads/ \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","contact":"john@example.com","company":"Example Corp","product_interest":"CRM Software","stage":"New"}'

# Get dashboard stats
curl http://localhost:8000/api/dashboard/stats
\`\`\`

## 📊 Database Schema

### Leads Table
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `contact` (String, Required)
- `company` (String, Required)
- `product_interest` (String, Required)
- `stage` (Enum: New, Contacted, Qualified, Proposal Sent, Won, Lost)
- `follow_up_date` (Date, Optional)
- `notes` (Text, Optional)
- `created_at`, `updated_at` (DateTime)

### Orders Table
- `id` (UUID, Primary Key)
- `lead_id` (UUID, Foreign Key to Leads)
- `status` (Enum: Order Received, In Development, Ready to Dispatch, Dispatched)
- `dispatch_date` (Date, Optional)
- `courier` (String, Optional)
- `tracking_number` (String, Optional)
- `created_at`, `updated_at` (DateTime)

## 🔄 Automation Rules

1. **Auto Order Creation**: When a lead is marked as "Won", an order is automatically created
2. **Follow-up Reminders**: Dashboard highlights leads with upcoming follow-ups
3. **Status Tracking**: Real-time updates of lead and order statuses

## 🎯 API Endpoints

### Leads
- `GET /api/leads` - Get all leads (with filtering)
- `POST /api/leads/` - Create a new lead
- `GET /api/leads/{id}` - Get a specific lead
- `PUT /api/leads/{id}` - Update a lead
- `DELETE /api/leads/{id}` - Delete a lead

### Orders
- `GET /api/orders` - Get all orders (with filtering)
- `POST /api/orders/` - Create a new order
- `GET /api/orders/{id}` - Get a specific order
- `PUT /api/orders/{id}` - Update an order

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.
