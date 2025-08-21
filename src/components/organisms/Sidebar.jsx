import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/tractors", label: "Tractor Fleet", icon: "Tractor" },
    { path: "/rentals", label: "Rent Records", icon: "FileText" },
    { path: "/payments", label: "Payments", icon: "CreditCard" },
    { path: "/reports", label: "Reports", icon: "BarChart3" },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
          "hover:bg-primary/10 hover:text-primary group",
          isActive
            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-r-2 border-primary"
            : "text-gray-600 hover:text-primary"
        )
      }
    >
      <ApperIcon 
        name={item.icon} 
        className={cn(
          "w-5 h-5 transition-colors",
          location.pathname === item.path ? "text-primary" : "text-gray-500 group-hover:text-primary"
        )} 
      />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex-1 flex flex-col min-h-0 py-6">
          <nav className="flex-1 px-6 space-y-2">
            {menuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
          
          <div className="px-6 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Pro Features</h4>
                  <p className="text-xs text-gray-500">Upgrade for advanced analytics</p>
                </div>
              </div>
              <Button size="sm" className="w-full">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <aside className={cn(
          "absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Tractor" className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-display font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TractorFlow
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
          
          <nav className="flex-1 px-6 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;