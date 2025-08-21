import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue,
  className = ""
}) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {value}
            </h3>
            {trend && (
              <span className={`text-sm font-medium flex items-center ${
                trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-gray-500"
              }`}>
                {trend === "up" && <ApperIcon name="TrendingUp" className="w-3 h-3 mr-1" />}
                {trend === "down" && <ApperIcon name="TrendingDown" className="w-3 h-3 mr-1" />}
                {trendValue}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} className="w-6 h-6 text-primary" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;