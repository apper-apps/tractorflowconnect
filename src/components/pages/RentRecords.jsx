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
import { rentalService } from "@/services/api/rentalService";
import { tractorService } from "@/services/api/tractorService";

const RentRecords = () => {
  const [rentals, setRentals] = useState([]);
  const [tractors, setTractors] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [rentalsData, tractorsData] = await Promise.all([
        rentalService.getAll(),
        tractorService.getAll()
      ]);
      
      setRentals(rentalsData);
      setTractors(tractorsData);
      setFilteredRentals(rentalsData);
    } catch (err) {
      setError("Failed to load rental records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter rentals based on search and status
  useEffect(() => {
    let filtered = rentals;

    // Filter by search term
    if (searchTerm) {
filtered = filtered.filter(rental =>
        rental.customer_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.farm_location_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by payment status
    if (selectedStatus !== "All") {
      filtered = filtered.filter(rental => rental.payment_status_c === selectedStatus);
    }
// Sort by start date (newest first)
    filtered = filtered.sort((a, b) => {
      const dateA = a.start_date_c ? new Date(a.start_date_c) : new Date(0);
      const dateB = b.start_date_c ? new Date(b.start_date_c) : new Date(0);
      return dateB - dateA;
    });

    setFilteredRentals(filtered);
  }, [rentals, searchTerm, selectedStatus]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

const getTractorById = (id) => {
    return tractors.find(t => t.Id === parseInt(id));
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Overdue":
        return "error";
      default:
        return "default";
    }
  };

  // Calculate filter counts
const statusCounts = rentals.reduce((acc, rental) => {
    acc[rental.payment_status_c] = (acc[rental.payment_status_c] || 0) + 1;
    return acc;
  }, {});

  const filterTabs = [
    { label: "All", value: "All", count: rentals.length },
    { label: "Pending", value: "Pending", count: statusCounts["Pending"] || 0 },
    { label: "Paid", value: "Paid", count: statusCounts["Paid"] || 0 },
    { label: "Overdue", value: "Overdue", count: statusCounts["Overdue"] || 0 }
  ];

  if (loading) return <Loading text="Loading rental records..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Rent Records</h1>
          <p className="mt-1 text-gray-600">Track and manage all rental agreements</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" icon="Download">
            Export Records
          </Button>
          <Button icon="Plus">
            New Rental
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholder="Search by customer name or location..."
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
          Showing {filteredRentals.length} of {rentals.length} records
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

      {/* Rental Records */}
      {filteredRentals.length === 0 ? (
        <Empty
          title={searchTerm || selectedStatus !== "All" ? "No records match your filters" : "No rental records found"}
          description={searchTerm || selectedStatus !== "All" 
            ? "Try adjusting your search or filter criteria."
            : "Create your first rental agreement to get started."
          }
          action={searchTerm ? handleClearSearch : undefined}
          actionLabel={searchTerm ? "Clear Search" : undefined}
          icon="FileText"
        />
      ) : (
        <div className="space-y-4">
          {filteredRentals.map((rental) => {
const tractorId = rental.tractor_id_c?.Id || rental.tractor_id_c;
            const tractor = getTractorById(tractorId) || { Name: 'Unknown Tractor' };
            return (
              <Card key={rental.Id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="Tractor" className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rental.customer_name_c}
                        </h3>
                        <Badge variant={getStatusVariant(rental.payment_status_c)}>
                          {rental.payment_status_c}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Tractor</p>
                          <p className="font-medium text-gray-900">
                            {tractor ? `${tractor.Name} (#${tractor.number_c})` : "Unknown Tractor"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">{rental.farm_location_c}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Rental Period</p>
                          <p className="font-medium text-gray-900">
                            {format(new Date(rental.start_date_c), "MMM dd")} - {format(new Date(rental.end_date_c), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Amount</p>
                          <p className="font-semibold text-primary text-lg">
                            ₹{rental.total_amount_c?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <Button variant="outline" size="sm" icon="Eye">
                      View
                    </Button>
                    <Button variant="outline" size="sm" icon="Edit">
                      Edit
                    </Button>
{rental.payment_status_c === "Pending" && (
                      <Button size="sm" icon="CreditCard">
                        Collect Payment
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

export default RentRecords;