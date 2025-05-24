const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Leads",
      value: stats?.total_leads || 0,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Open Leads",
      value: stats?.open_leads || 0,
      icon: "📈",
      color: "bg-green-500",
    },
    {
      title: "Conversion Rate",
      value: `${stats?.conversion_rate || 0}%`,
      icon: "💯",
      color: "bg-purple-500",
    },
    {
      title: "Follow-ups This Week",
      value: stats?.leads_due_this_week?.length || 0,
      icon: "📅",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className={`${card.color} rounded-full p-3 text-white text-2xl mr-4`}>{card.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
