import { Link, useLocation } from "react-router-dom";
import { Home, Book, Users, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/dashboard" },
    // { icon: <Book size={20} />, label: "Reading", path: "/reading" },
    { icon: <Users size={20} />, label: "Groups", path: "/group" },
    // { icon: <User size={20} />, label: "Profile", path: "/profile" },
  ];
  
  return (
    <div className="w-64 bg-white shadow-md min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Reading Tracker</h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive(item.path) ? '' : 'text-gray-600'}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t mt-auto">
        <Button variant="outline" className="w-full justify-start text-gray-600" onClick={handleSignOut}>
          <LogOut size={20} className="mr-3" 
          onClick={signOut()}
          />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
