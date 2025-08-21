import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TractorCard = ({ tractor, onBook, onViewDetails }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "Available":
        return "available";
      case "On Rent":
        return "rented";
      case "Maintenance":
        return "maintenance";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available":
        return "CheckCircle";
      case "On Rent":
        return "Clock";
      case "Maintenance":
        return "AlertTriangle";
      default:
        return "Circle";
    }
  };

  return (
    <Card hover className="overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <ApperIcon name="Tractor" className="w-16 h-16 text-primary/40" />
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusVariant(tractor.status)}>
            <ApperIcon name={getStatusIcon(tractor.status)} className="w-3 h-3 mr-1" />
            {tractor.status}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{tractor.name}</h3>
          <p className="text-sm text-gray-600">#{tractor.number}</p>
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Hourly Rate</span>
            <span className="font-semibold text-primary">₹{tractor.hourlyRate}/hr</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Daily Rate</span>
            <span className="font-semibold text-primary">₹{tractor.dailyRate}/day</span>
          </div>
        </div>
        
<div className="flex space-x-2">
{tractor.status === "Available" && (
<Button 
className="flex-1" 
onClick={() => onBook(tractor)}
icon="Calendar"
>
Book Now
</Button>
)}
<Button 
variant="outline" 
className={tractor.status === "Available" ? "" : "flex-1"}
onClick={() => onViewDetails(tractor)}
icon="MapPin"
>
{tractor.status === "Available" ? "Assign to Farm" : "Details"}
</Button>
</div>
      </div>
    </Card>
  );
};

export default TractorCard;