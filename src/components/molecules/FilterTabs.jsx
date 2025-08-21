import Button from "@/components/atoms/Button";

const FilterTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "" 
}) => {
  return (
    <div className={`flex space-x-1 bg-gray-100 p-1 rounded-lg ${className}`}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant={activeTab === tab.value ? "primary" : "ghost"}
          size="sm"
          onClick={() => onTabChange(tab.value)}
          className={`flex-1 ${
            activeTab === tab.value 
              ? "shadow-sm" 
              : "text-gray-600 hover:text-gray-900 bg-transparent hover:bg-white/50"
          }`}
        >
          {tab.label}
          {tab.count && (
            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
              activeTab === tab.value 
                ? "bg-white/20 text-white" 
                : "bg-gray-200 text-gray-600"
            }`}>
              {tab.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default FilterTabs;