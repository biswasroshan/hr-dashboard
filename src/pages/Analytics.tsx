
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, TrendingUp, Star, Award } from "lucide-react";
import { Employee } from "@/types/employee";

const AnalyticsPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/users?limit=20');
      const data = await response.json();
      
      const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design'];
      
      const processedEmployees: Employee[] = data.users.map((user: any) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        phone: user.phone,
        image: user.image,
        address: user.address,
        department: departments[Math.floor(Math.random() * departments.length)],
        rating: Math.floor(Math.random() * 5) + 1,
        role: user.company?.title || 'Employee',
        bio: `Experienced professional with ${Math.floor(Math.random() * 10) + 1} years of experience.`,
        joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0]
      }));
      
      setEmployees(processedEmployees);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentStats = () => {
    const departmentData: Record<string, { count: number; totalRating: number; avgRating: number }> = {};
    
    employees.forEach(emp => {
      if (!departmentData[emp.department]) {
        departmentData[emp.department] = { count: 0, totalRating: 0, avgRating: 0 };
      }
      departmentData[emp.department].count++;
      departmentData[emp.department].totalRating += emp.rating;
    });

    return Object.entries(departmentData).map(([department, data]) => ({
      department,
      count: data.count,
      avgRating: Number((data.totalRating / data.count).toFixed(1))
    }));
  };

  const getRatingDistribution = () => {
    const ratingData = [1, 2, 3, 4, 5].map(rating => ({
      rating: `${rating} Star${rating > 1 ? 's' : ''}`,
      count: employees.filter(emp => emp.rating === rating).length
    }));
    return ratingData;
  };

  const getPerformanceTrend = () => {
    // Mock monthly performance data
    return [
      { month: 'Jan', avgRating: 3.8, employees: 18 },
      { month: 'Feb', avgRating: 3.9, employees: 19 },
      { month: 'Mar', avgRating: 4.1, employees: 20 },
      { month: 'Apr', avgRating: 4.0, employees: 20 },
      { month: 'May', avgRating: 4.2, employees: 20 },
      { month: 'Jun', avgRating: 4.1, employees: 20 }
    ];
  };

  const departmentStats = getDepartmentStats();
  const ratingDistribution = getRatingDistribution();
  const performanceTrend = getPerformanceTrend();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const totalEmployees = employees.length;
  const avgRating = employees.reduce((acc, emp) => acc + emp.rating, 0) / totalEmployees;
  const highPerformers = employees.filter(emp => emp.rating >= 4).length;
  const topDepartment = departmentStats.sort((a, b) => b.avgRating - a.avgRating)[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
            <p className="text-gray-600 mt-1">Insights and trends across your organization</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalEmployees}</div>
              <p className="text-xs text-gray-500 mt-1">Active employees</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
              <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">High Performers</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{highPerformers}</div>
              <p className="text-xs text-gray-500 mt-1">{((highPerformers / totalEmployees) * 100).toFixed(0)}% of total</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Top Department</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{topDepartment?.department}</div>
              <p className="text-xs text-gray-500 mt-1">{topDepartment?.avgRating} avg rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Department Performance */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgRating" fill="#3B82F6" name="Average Rating" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ rating, count }) => `${rating}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trend */}
        <Card className="bg-white shadow-sm mb-8">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[3.5, 4.5]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avgRating" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Average Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Breakdown Table */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Department</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Employees</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Avg Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((dept, index) => (
                    <tr key={dept.department} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">{dept.department}</td>
                      <td className="py-3 px-4 text-gray-600">{dept.count}</td>
                      <td className="py-3 px-4 text-gray-600">{dept.avgRating}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= dept.avgRating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
