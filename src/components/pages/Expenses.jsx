import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Expenses = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Expenses</h1>
          <p className="mt-1 text-gray-600">Track operational costs and maintenance expenses</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" icon="Download">
            Export Expenses
          </Button>
          <Button icon="Plus">
            Add Expense
          </Button>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12">
        <Empty
          title="Expense Management Coming Soon"
          description="This feature will help you track fuel costs, maintenance expenses, repairs, and other operational costs. Coming soon!"
          icon="Receipt"
        />
      </Card>
    </div>
  );
};

export default Expenses;