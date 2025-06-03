
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Bookmark, TrendingUp, BookmarkCheck } from "lucide-react";
import { Employee } from "@/types/employee";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isBookmarked = bookmarks.includes(employee.id);

  const handleBookmark = () => {
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
    toast({
      title: "Promotion initiated",
      description: `Promotion process started for ${employee.firstName} ${employee.lastName}`,
    });
  };

  const handleView = () => {
    navigate(`/employee/${employee.id}`);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      'Engineering': 'bg-blue-100 text-blue-800',
      'Marketing': 'bg-purple-100 text-purple-800',
      'Sales': 'bg-green-100 text-green-800',
      'HR': 'bg-pink-100 text-pink-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Design': 'bg-indigo-100 text-indigo-800',
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <img
              src={employee.image}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
              <div className={`w-3 h-3 rounded-full ${employee.rating >= 4 ? 'bg-green-400' : employee.rating >= 3 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-500 truncate">{employee.role}</p>
            <p className="text-xs text-gray-400 truncate">{employee.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={getDepartmentColor(employee.department)}>
              {employee.department}
            </Badge>
            <span className="text-sm text-gray-500">Age {employee.age}</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-700">Performance:</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= employee.rating
                      ? getRatingColor(employee.rating) + ' fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600">({employee.rating}/5)</span>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className={`${isBookmarked ? 'bg-purple-50 border-purple-200 text-purple-700' : 'hover:bg-purple-50 hover:border-purple-200'}`}
            >
              {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePromote}
              className="hover:bg-green-50 hover:border-green-200"
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
