import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FilterTabs from "@/components/molecules/FilterTabs";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { paymentService } from "@/services/api/paymentService";
import { rentalService } from "@/services/api/rentalService";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [paymentsData, rentalsData] = await Promise.all([
        paymentService.getAll(),
        rentalService.getAll()
      ]);
      
      setPayments(paymentsData);
      setRentals(rentalsData);
      setFilteredPayments(paymentsData);
    } catch (err) {
      setError("Failed to load payment records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter payments based on search and status
  useEffect(() => {
    let filtered = payments;

    // Filter by search term
    if (searchTerm) {
const searchRentals = rentals.filter(rental =>
        rental.customer_name_c?.toLowerCase().includes(searchTerm.toLowerCase())
      ).map(r => r.Id);
      
      filtered = filtered.filter(payment =>
        searchRentals.includes(payment.rental_id_c?.Id || payment.rental_id_c) ||
        payment.method_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
if (selectedStatus !== "All") {
      filtered = filtered.filter(payment => payment.status_c === selectedStatus);
    }

    // Sort by paid date (newest first)
filtered = filtered.sort((a, b) => new Date(b.paid_date_c) - new Date(a.paid_date_c));

    setFilteredPayments(filtered);
  }, [payments, rentals, searchTerm, selectedStatus]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

const getRentalById = (id) => {
    return rentals.find(r => r.Id === parseInt(id));
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "error";
      default:
        return "default";
    }
  };

  const getMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case "cash":
        return "Banknote";
      case "bank transfer":
        return "Building2";
      case "upi":
        return "Smartphone";
      case "card":
        return "CreditCard";
      default:
        return "CreditCard";
    }
  };

  // Calculate filter counts and stats
const statusCounts = payments.reduce((acc, payment) => {
    acc[payment.status_c] = (acc[payment.status_c] || 0) + 1;
    return acc;
  }, {});

  const stats = {
totalAmount: payments.filter(p => p.status_c === "Completed").reduce((sum, p) => sum + p.amount_c, 0),
    pendingAmount: payments.filter(p => p.status_c === "Pending").reduce((sum, p) => sum + p.amount_c, 0),
    completedPayments: statusCounts["Completed"] || 0,
    pendingPayments: statusCounts["Pending"] || 0
  };

  const filterTabs = [
    { label: "All", value: "All", count: payments.length },
    { label: "Completed", value: "Completed", count: statusCounts["Completed"] || 0 },
    { label: "Pending", value: "Pending", count: statusCounts["Pending"] || 0 },
    { label: "Failed", value: "Failed", count: statusCounts["Failed"] || 0 }
  ];

  if (loading) return <Loading text="Loading payment records..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Payments</h1>
          <p className="mt-1 text-gray-600">Monitor and manage rental payments</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" icon="Download">
            Export Payments
          </Button>
          <Button icon="Plus">
            Record Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Collected</p>
              <p className="text-lg font-semibold text-success">₹{stats.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className="text-lg font-semibold text-warning">₹{stats.pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CreditCard" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-lg font-semibold text-primary">{stats.completedPayments}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertCircle" className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-lg font-semibold text-accent">{stats.pendingPayments}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholder="Search by customer name or payment method..."
            className="flex-1 max-w-md"
          />
          
          <FilterTabs
            tabs={filterTabs}
            activeTab={selectedStatus}
            onTabChange={setSelectedStatus}
            className="flex-shrink-0"
          />
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredPayments.length} of {payments.length} payments
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="text-sm border-0 bg-transparent focus:ring-0 text-gray-900 font-medium">
            <option>Latest</option>
            <option>Amount</option>
            <option>Status</option>
          </select>
        </div>
      </div>

      {/* Payment Records */}
      {filteredPayments.length === 0 ? (
        <Empty
          title={searchTerm || selectedStatus !== "All" ? "No payments match your filters" : "No payment records found"}
          description={searchTerm || selectedStatus !== "All" 
            ? "Try adjusting your search or filter criteria."
            : "Payment records will appear here as customers make payments."
          }
          action={searchTerm ? handleClearSearch : undefined}
          actionLabel={searchTerm ? "Clear Search" : undefined}
          icon="CreditCard"
        />
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => {
const rentalId = payment.rental_id_c?.Id || payment.rental_id_c;
            const rental = getRentalById(rentalId);
            return (
              <Card key={payment.Id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={getMethodIcon(payment.method_c)} className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rental ? rental.customer_name_c : "Unknown Customer"}
                        </h3>
                        <Badge variant={getStatusVariant(payment.status_c)}>
                          {payment.status_c}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Amount</p>
                          <p className="font-semibold text-primary text-lg">
                            ₹{payment.amount_c?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Method</p>
                          <p className="font-medium text-gray-900 capitalize">{payment.method_c}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-medium text-gray-900">
                            {format(new Date(payment.paid_date_c), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      
                      {rental && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Rental: {rental.farm_location_c} • {format(new Date(rental.start_date_c), "MMM dd")} - {format(new Date(rental.end_date_c), "MMM dd")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <Button variant="outline" size="sm" icon="FileText">
                      Receipt
                    </Button>
                    <Button variant="outline" size="sm" icon="Eye">
                      View Details
                    </Button>
{payment.status_c === "Pending" && (
                      <Button size="sm" icon="Check">
                        Confirm
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Payments;