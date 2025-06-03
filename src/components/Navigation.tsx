
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, BarChart3, Bookmark } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600">
              HR Dashboard
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/bookmarks">
                <Button 
                  variant={isActive('/bookmarks') ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  Bookmarks
                </Button>
              </Link>
              <Link to="/analytics">
                <Button 
                  variant={isActive('/analytics') ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:hidden flex space-x-2">
            <Link to="/">
              <Button 
                variant={isActive('/') ? "default" : "ghost"} 
                size="sm"
              >
                <Users className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/bookmarks">
              <Button 
                variant={isActive('/bookmarks') ? "default" : "ghost"} 
                size="sm"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/analytics">
              <Button 
                variant={isActive('/analytics') ? "default" : "ghost"} 
                size="sm"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
