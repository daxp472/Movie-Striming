const RecentActivities = () => {
  const activities = [
    {
      user: 'John Doe',
      action: 'watched',
      target: 'Inception',
      time: '2 minutes ago',
    },
    {
      user: 'Jane Smith',
      action: 'rated',
      target: 'The Dark Knight',
      time: '5 minutes ago',
    },
    {
      user: 'Mike Johnson',
      action: 'subscribed to',
      target: 'Premium Plan',
      time: '10 minutes ago',
    },
    {
      user: 'Sarah Wilson',
      action: 'commented on',
      target: 'Interstellar',
      time: '15 minutes ago',
    },
  ];

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
      <div className="mt-6 flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {activities.map((activity, index) => (
            <li key={index} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.action} {activity.target}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View all activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivities;
