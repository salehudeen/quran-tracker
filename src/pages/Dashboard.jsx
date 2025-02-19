import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import { Progress } from "@/components/ui/progress";
import { Users, Book, Settings } from "lucide-react";

const Dashboard = () => {
  const [progress, setProgress] = useState({
    surah: "Al-Baqarah",
    juz: 2,
    hizb: 3,
    verse: 142,
    completion: 40, // Simulating progress percentage
  });

  const groups = [
    { id: 1, name: "Morning Reciters" },
    { id: 2, name: "Evening Quran Study" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">📖 My Dashboard</h1>
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
                {groups.map((group) => (
                  <li
                    key={group.id}
                    className="p-3 bg-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-200 transition"
                  >
                    {group.name}
                    <Button variant="outline" size="sm">
                      Join
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Current Progress */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Current Progress
              </CardTitle>
              <Book size={20} className="text-gray-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                <strong>Surah:</strong> {progress.surah}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Juz:</strong> {progress.juz}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Hizb:</strong> {progress.hizb}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Verse:</strong> {progress.verse}
              </p>

              {/* Progress Bar */}
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-600">
                  Completion: {progress.completion}%
                </p>
                <Progress value={progress.completion} className="mt-2" />
              </div>
            </CardContent>
          </Card>

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
