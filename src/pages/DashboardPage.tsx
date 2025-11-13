import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  WrenchScrewdriverIcon, 
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon 
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  growth: number;
  currency?: boolean;
}

const DashboardPage = () => {
  // Sample data - in a real app, this would come from API
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTechnicians: 0,
    totalBookings: 0,
    totalRevenue: 0,
    customerGrowth: 12.5,
    technicianGrowth: 8.3,
    bookingGrowth: 15.7,
    revenueGrowth: 10.2
  });

  const bookingData = [
    { name: 'Jan', completed: 65, pending: 23, cancelled: 12 },
    { name: 'Feb', completed: 72, pending: 25, cancelled: 15 },
    { name: 'Mar', completed: 85, pending: 30, cancelled: 10 },
    { name: 'Apr', completed: 93, pending: 27, cancelled: 8 },
    { name: 'May', completed: 101, pending: 32, cancelled: 11 },
    { name: 'Jun', completed: 110, pending: 35, cancelled: 14 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 4500 },
    { name: 'Feb', revenue: 5200 },
    { name: 'Mar', revenue: 6100 },
    { name: 'Apr', revenue: 7300 },
    { name: 'May', revenue: 8200 },
    { name: 'Jun', revenue: 9500 },
  ];

  const serviceData = [
    { name: 'Construction', value: 35 },
    { name: 'Plumbing', value: 25 },
    { name: 'Electrical', value: 20 },
    { name: 'Interior Design', value: 15 },
    { name: 'Cleaning', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Simulate fetching data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setStats({
        totalCustomers: 1254,
        totalTechnicians: 387,
        totalBookings: 3128,
        totalRevenue: 145800,
        customerGrowth: 12.5,
        technicianGrowth: 8.3,
        bookingGrowth: 15.7,
        revenueGrowth: 10.2
      });
    }, 500);
  }, []);

  const StatCard = ({ title, value, icon: Icon, growth, currency = false }: StatCardProps) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">
            {currency && '$'}{typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <div className="flex items-center">
        {growth > 0 ? (
          <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm ${growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {Math.abs(growth)}% 
        </span>
        <span className="text-gray-500 text-sm ml-1">from last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your business performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Customers" 
          value={stats.totalCustomers} 
          icon={UsersIcon} 
          growth={stats.customerGrowth} 
        />
        <StatCard 
          title="Total Technicians" 
          value={stats.totalTechnicians} 
          icon={WrenchScrewdriverIcon} 
          growth={stats.technicianGrowth} 
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings} 
          icon={CalendarDaysIcon} 
          growth={stats.bookingGrowth} 
        />
        <StatCard 
          title="Total Revenue" 
          value={stats.totalRevenue} 
          icon={CurrencyDollarIcon} 
          growth={stats.revenueGrowth} 
          currency={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Booking Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bookingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#4ade80" name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#facc15" name="Pending" />
                <Bar dataKey="cancelled" stackId="a" fill="#f87171" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Service Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Service Distribution</h2>
        <div className="h-80 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 