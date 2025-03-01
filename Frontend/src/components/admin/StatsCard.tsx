import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string;
  icon: IconType;
  change: string;
}

const StatsCard = ({ title, value, icon: Icon, change }: StatsCardProps) => {
  const isPositive = change.startsWith('+');

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="rounded-full bg-blue-50 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-4">
        <span
          className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change}
        </span>
        <span className="text-sm text-gray-600"> from last month</span>
      </div>
    </div>
  );
};

export default StatsCard;
