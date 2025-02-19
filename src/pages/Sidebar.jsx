import { Home, Book, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
    const navigate = useNavigate();
  const menuItems = [
    { id: 1, name: "Dashboard", icon: <Home size={18} />, active: true },
    { id: 2, name: "My Progress", icon: <Book size={18} />, active: false },
    { id: 3, name: "Groups", icon: <Users size={18} />, active: false },
    { id: 4, name: "Settings", icon: <Settings size={18} />, active: false },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="text-2xl font-bold text-center mb-8">
        📖 Quran Tracker
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center gap-3 w-full p-3 rounded-lg transition",
              item.active
                ? "bg-blue-600"
                : "hover:bg-gray-800 text-gray-300 hover:text-white"
            )}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <Button variant="destructive" className="mt-auto"
      onClick={() => {
       signOut();
       navigate('/')
      }}
      >
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;
