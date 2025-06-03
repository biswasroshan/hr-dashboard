import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, TrendingUp, Star, ChevronDown, Plus, LogIn } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmployeeCard from "@/components/EmployeeCard";
import CreateUserModal from "@/components/CreateUserModal";
import LoginModal from "@/components/LoginModal";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Employee } from "@/types/employee";

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [displayedEmployees, setDisplayedEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(5);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { bookmarks } = useBookmarks();

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, departmentFilter, ratingFilter]);

  useEffect(() => {
    setDisplayedEmployees(filteredEmployees.slice(0, showCount));
  }, [filteredEmployees, showCount]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/users?limit=20');
      const data = await response.json();
      
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
        bio: `Experienced professional with ${Math.floor(Math.random() * 10) + 1} years of experience in ${departments[Math.floor(Math.random() * departments.length)].toLowerCase()}.`,
        joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0]
      }));
      
      setEmployees(processedEmployees);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.role.toLowerCase().includes(searchLower)
      );
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(emp => emp.rating === parseInt(ratingFilter));
    }

    setFilteredEmployees(filtered);
    setShowCount(5); // Reset to show 5 when filtering
  };

  const handleLoadMore = () => {
    setShowCount(prev => Math.min(prev + 5, filteredEmployees.length));
  };

  const handleCreateUser = (userData: any) => {
    const newEmployee: Employee = {
      id: employees.length + 1,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      age: userData.age,
      phone: userData.phone || 'N/A',
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.firstName}`,
      address: {
        address: userData.address || 'N/A',
        city: 'N/A',
        state: 'N/A',
        stateCode: 'N/A',
        postalCode: 'N/A',
        country: 'N/A'
      },
      department: userData.department,
      rating: 3,
      role: userData.role || 'Employee',
      bio: 'New team member',
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setEmployees(prev => [newEmployee, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Mock authentication - in real app, this would validate against a backend
    if (credentials.email && credentials.password) {
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const getStats = () => {
    const totalEmployees = employees.length;
    const avgRating = employees.length > 0 ? employees.reduce((acc, emp) => acc + emp.rating, 0) / totalEmployees : 0;
    const highPerformers = employees.filter(emp => emp.rating >= 4).length;
    const bookmarkedCount = bookmarks.length;

    return { totalEmployees, avgRating, highPerformers, bookmarkedCount };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.9), rgba(99, 102, 241, 0.9)), url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-6 flex justify-center items-center gap-4">
              <h1 className="text-6xl font-bold mb-4 animate-fade-in">HR Performance Dashboard</h1>
              {!isAuthenticated ? (
                <Button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                  variant="outline"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              ) : (
                <Button 
                  onClick={handleLogout}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                  variant="outline"
                >
                  Logout
                </Button>
              )}
            </div>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto animate-fade-in delay-200">
              Manage your team's performance, track achievements, and drive organizational success with powerful insights and beautiful analytics.
            </p>
            <div className="flex justify-center space-x-6 animate-fade-in delay-400">
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Employee
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-indigo-300/30 rounded-full blur-lg"></div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 -mt-20 relative z-10">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</div>
                <p className="text-sm text-green-600 mt-1 font-medium">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2 animate-fade-in delay-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
                <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</div>
                <p className="text-sm text-green-600 mt-1 font-medium">+0.3 from last quarter</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2 animate-fade-in delay-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">High Performers</CardTitle>
                <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.highPerformers}</div>
                <p className="text-sm text-green-600 mt-1 font-medium">75% of total team</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2 animate-fade-in delay-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bookmarked</CardTitle>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.bookmarkedCount}</div>
                <p className="text-sm text-blue-600 mt-1 font-medium">Priority employees</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-10 bg-white/80 backdrop-blur-sm shadow-xl border-0 animate-fade-in">
            <CardContent className="pt-8 pb-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search employees by name, email, department, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex gap-4">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-56 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg shadow-sm">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-40 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg shadow-sm">
                      <SelectValue placeholder="All Ratings" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Team Members</h2>
              <p className="text-gray-600 mt-2 text-lg">
                Showing {displayedEmployees.length} of {filteredEmployees.length} employees
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 mb-8">
            {displayedEmployees.map((employee, index) => (
              <div 
                key={employee.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EmployeeCard employee={employee} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {filteredEmployees.length > displayedEmployees.length && (
            <div className="text-center animate-fade-in">
              <Button 
                onClick={handleLoadMore}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <ChevronDown className="h-5 w-5 mr-2" />
                Load More ({filteredEmployees.length - displayedEmployees.length} remaining)
              </Button>
            </div>
          )}

          {/* No Results */}
          {filteredEmployees.length === 0 && !loading && (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-8xl mb-8">🔍</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No employees found</h3>
              <p className="text-gray-600 text-xl mb-8 max-w-md mx-auto">
                Try adjusting your search terms or filter criteria to find what you're looking for
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setDepartmentFilter('all');
                  setRatingFilter('all');
                }}
                variant="outline"
                className="px-8 py-3 text-lg border-2 hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateUserModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
