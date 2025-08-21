import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Customers = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-gray-600">Manage your customer database and relationships</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" icon="Download">
            Export List
          </Button>
          <Button icon="Plus">
            Add Customer
          </Button>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12">
        <Empty
          title="Customer Management Coming Soon"
          description="This feature will allow you to manage customer information, rental history, and contact details. Stay tuned for updates!"
          icon="Users"
        />
      </Card>
    </div>
  );
};

export default Customers;