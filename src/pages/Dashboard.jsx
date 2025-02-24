import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { generateClient } from '@aws-amplify/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import { Progress } from "@/components/ui/progress";
import { Users, Book, Settings } from "lucide-react";
import * as queries from '../graphql/queries';
import ReadingProgress from "./ReadingProgress";

const client = generateClient();

const Dashboard = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get userId from location state or localStorage
        const userId = location.state?.userId || localStorage.getItem('userId');
        
        if (!userId) {
          throw new Error('No user ID found');
        }

        // Fetch user data using the query
        const response = await client.graphql({
          query: queries.getUser,
          variables: { id: userId }
        });

        const user = response.data.getUser;
        setUserData(user);

        // Update progress state with actual data
        if (user.progress) {
          setProgress({
            surah: user.progress.currentSurah || "Not started",
            juz: user.progress.currentJuz || 0,
            verse: user.progress.currentAyah || 0,
            completion: calculateCompletion(user.progress),
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location.state?.userId]);

  // Calculate completion percentage based on progress data
  const calculateCompletion = (progress) => {
    if (!progress) return 0;
    // This is a simple calculation - adjust based on your needs
    const completedSurahs = progress.completedSurahs?.length || 0;
    return Math.round((completedSurahs / 114) * 100); // 114 is total number of surahs
  };

  const [progress, setProgress] = useState({
    surah: "Loading...",
    juz: 0,
    verse: 0,
    completion: 0,
  });

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">
      <p>Loading your dashboard...</p>
    </div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center">
      <p className="text-red-500">Error: {error}</p>
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 space-y-8">
        {/* Page Title with User Name */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {userData?.name || 'Reader'} 📖
          </h1>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings size={18} /> Settings
          </Button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Groups */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">My Groups</CardTitle>
              <Users size={20} className="text-gray-600" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {userData?.groups?.items?.map((group) => (
                  <li
                    key={group.id}
                    className="p-3 bg-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-200 transition"
                  >
                    {group.name}
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </li>
                )) || (
                  <li className="text-gray-500">No groups joined yet</li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Current Progress */}
         <ReadingProgress
         userId={userData.id}
         currentProgress={userData?.progress}
         />

          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button className="w-full">Start New Reading</Button>
              <Button variant="outline" className="w-full">
                View Past Sessions
              </Button>
              <Button variant="destructive" className="w-full">
                Reset Progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;