
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkX, Users, TrendingUp, Eye } from "lucide-react";
import { Employee } from "@/types/employee";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import EmployeeCard from "@/components/EmployeeCard";

const BookmarksPage = () => {
  const [bookmarkedEmployees, setBookmarkedEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { bookmarks } = useBookmarks();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookmarkedEmployees();
  }, [bookmarks]);

  const fetchBookmarkedEmployees = async () => {
    if (bookmarks.length === 0) {
      setBookmarkedEmployees([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const employees: Employee[] = [];
      const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design'];

      for (const id of bookmarks) {
        try {
          const response = await fetch(`https://dummyjson.com/users/${id}`);
          const userData = await response.json();
          
          const employee: Employee = {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            age: userData.age,
            phone: userData.phone,
            image: userData.image,
            address: userData.address,
            department: departments[Math.floor(Math.random() * departments.length)],
            rating: Math.floor(Math.random() * 5) + 1,
            role: userData.company?.title || 'Employee',
            bio: `Experienced professional with ${Math.floor(Math.random() * 10) + 1} years of experience.`,
            joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0]
          };
          
          employees.push(employee);
        } catch (error) {
          console.error(`Failed to fetch employee ${id}:`, error);
        }
      }

      setBookmarkedEmployees(employees);
    } catch (error) {
      console.error('Failed to fetch bookmarked employees:', error);
      toast({
        title: "Error",
        description: "Failed to load bookmarked employees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToProject = (employee: Employee) => {
    toast({
      title: "Project Assignment",
      description: `${employee.firstName} ${employee.lastName} has been assigned to a new project`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookmarked employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookmarked Employees</h1>
              <p className="text-gray-600 mt-1">Manage your saved employee profiles</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Users className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <Card className="mb-8 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookmarkX className="h-5 w-5 text-purple-600" />
              Bookmark Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{bookmarkedEmployees.length}</div>
                <div className="text-sm text-gray-600">Total Bookmarked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {bookmarkedEmployees.filter(emp => emp.rating >= 4).length}
                </div>
                <div className="text-sm text-gray-600">High Performers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {new Set(bookmarkedEmployees.map(emp => emp.department)).size}
                </div>
                <div className="text-sm text-gray-600">Departments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {bookmarkedEmployees.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-12 pb-12 text-center">
              <BookmarkX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarked employees</h3>
              <p className="text-gray-600 mb-6">
                Start bookmarking employees from the dashboard to keep track of your team members.
              </p>
              <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Users className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      bookmarkedEmployees.forEach(emp => handleAssignToProject(emp));
                    }}
                    className="hover:bg-green-50 hover:border-green-200"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Assign All to Project
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Performance Review",
                        description: "Performance review scheduled for all bookmarked employees",
                      });
                    }}
                    className="hover:bg-blue-50 hover:border-blue-200"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Schedule Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarkedEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
