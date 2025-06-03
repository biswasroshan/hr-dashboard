
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Star, Mail, Phone, MapPin, Calendar, Bookmark, TrendingUp, BookmarkCheck } from "lucide-react";
import { Employee, Project, Feedback } from "@/types/employee";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/hooks/use-toast";

const EmployeePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { toast } = useToast();

  const isBookmarked = employee ? bookmarks.includes(employee.id) : false;

  useEffect(() => {
    if (id) {
      fetchEmployeeData(parseInt(id));
    }
  }, [id]);

  const fetchEmployeeData = async (employeeId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/users/${employeeId}`);
      const userData = await response.json();
      
      const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design'];
      
      const employeeData: Employee = {
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
        bio: `Experienced professional with ${Math.floor(Math.random() * 10) + 1} years of experience in ${departments[Math.floor(Math.random() * departments.length)].toLowerCase()}. Passionate about delivering high-quality work and contributing to team success.`,
        joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0]
      };

      // Generate mock projects
      const mockProjects: Project[] = [
        {
          id: 1,
          name: 'Q4 Performance Review System',
          status: 'active',
          progress: 75,
          deadline: '2024-06-15'
        },
        {
          id: 2,
          name: 'Employee Onboarding Platform',
          status: 'completed',
          progress: 100,
          deadline: '2024-05-01'
        },
        {
          id: 3,
          name: 'Data Analytics Dashboard',
          status: 'pending',
          progress: 25,
          deadline: '2024-07-30'
        }
      ];

      // Generate mock feedback
      const mockFeedback: Feedback[] = [
        {
          id: 1,
          author: 'Sarah Johnson',
          date: '2024-05-20',
          rating: 5,
          comment: 'Excellent work on the recent project. Shows great leadership skills and attention to detail.',
          type: 'manager'
        },
        {
          id: 2,
          author: 'Mike Chen',
          date: '2024-05-15',
          rating: 4,
          comment: 'Very collaborative and helpful team member. Always willing to share knowledge.',
          type: 'peer'
        },
        {
          id: 3,
          author: 'Self Assessment',
          date: '2024-05-10',
          rating: 4,
          comment: 'I feel confident in my technical skills but would like to improve my public speaking abilities.',
          type: 'self'
        }
      ];

      setEmployee(employeeData);
      setProjects(mockProjects);
      setFeedback(mockFeedback);
    } catch (error) {
      console.error('Failed to fetch employee data:', error);
      toast({
        title: "Error",
        description: "Failed to load employee data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    if (!employee) return;
    
    if (isBookmarked) {
      removeBookmark(employee.id);
      toast({
        title: "Bookmark removed",
        description: `${employee.firstName} ${employee.lastName} removed from bookmarks`,
      });
    } else {
      addBookmark(employee.id);
      toast({
        title: "Employee bookmarked",
        description: `${employee.firstName} ${employee.lastName} added to bookmarks`,
      });
    }
  };

  const handlePromote = () => {
    if (!employee) return;
    toast({
      title: "Promotion initiated",
      description: `Promotion process started for ${employee.firstName} ${employee.lastName}`,
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'peer': return 'bg-blue-100 text-blue-800';
      case 'self': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee not found</h2>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
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
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-gray-600 mt-1">{employee.role} • {employee.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleBookmark}
                className={`${isBookmarked ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}`}
              >
                {isBookmarked ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button onClick={handlePromote} className="bg-green-600 hover:bg-green-700 text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Promote
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <img
                    src={employee.image}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
                  />
                  <h2 className="text-xl font-bold text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <p className="text-gray-600">{employee.role}</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">{employee.department}</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{employee.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {employee.address.city}, {employee.address.state}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Joined {employee.joinDate}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Performance Rating</span>
                    <span className="text-sm text-gray-600">({employee.rating}/5)</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= employee.rating
                            ? getRatingColor(employee.rating) + ' fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <Progress value={employee.rating * 20} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Employee Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Biography</h3>
                      <p className="text-gray-600 leading-relaxed">{employee.bio}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">Age</div>
                          <div className="text-lg font-semibold text-gray-900">{employee.age} years old</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">Department</div>
                          <div className="text-lg font-semibold text-gray-900">{employee.department}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">Join Date</div>
                          <div className="text-lg font-semibold text-gray-900">{new Date(employee.joinDate).toLocaleDateString()}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="text-lg font-semibold text-gray-900">{employee.address.city}, {employee.address.state}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Current Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{project.name}</h4>
                            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-gray-900 font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                            <div className="text-sm text-gray-500">
                              Deadline: {new Date(project.deadline).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feedback">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Performance Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {feedback.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold text-gray-900">{item.author}</span>
                              <Badge className={getFeedbackTypeColor(item.type)}>{item.type}</Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= item.rating
                                        ? getRatingColor(item.rating) + ' fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{item.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
