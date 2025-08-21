import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Drivers = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Drivers</h1>
          <p className="mt-1 text-gray-600">Manage your driver database</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" icon="Download">
            Export List
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Drivers</p>
              <p className="text-lg font-semibold text-primary">0</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Drivers</p>
              <p className="text-lg font-semibold text-success">0</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-gray-600">On Duty</p>
              <p className="text-lg font-semibold text-warning">0</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Empty State */}
      <Card className="p-12">
        <Empty
          title="No drivers found"
          description="Your driver database is currently empty. Driver records will appear here when available."
          icon="User"
        />
      </Card>
    </div>
  );
};

export default Drivers;