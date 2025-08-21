import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TractorCard from "@/components/molecules/TractorCard";
import SearchBar from "@/components/molecules/SearchBar";
import FilterTabs from "@/components/molecules/FilterTabs";
import BookingModal from "@/components/organisms/BookingModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { tractorService } from "@/services/api/tractorService";

const TractorList = () => {
  const [tractors, setTractors] = useState([]);
  const [filteredTractors, setFilteredTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const loadTractors = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await tractorService.getAll();
      setTractors(data);
      setFilteredTractors(data);
    } catch (err) {
      setError("Failed to load tractors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTractors();
  }, []);

  // Filter tractors based on search and status
  useEffect(() => {
    let filtered = tractors;

    // Filter by search term
    if (searchTerm) {
filtered = filtered.filter(tractor =>
        tractor.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tractor.number_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== "All") {
filtered = filtered.filter(tractor => tractor.status_c === selectedStatus);
    }

    setFilteredTractors(filtered);
  }, [tractors, searchTerm, selectedStatus]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleBookTractor = (tractor) => {
if (tractor.status_c !== "Available") {
      toast.warning("This tractor is not available for booking");
      return;
    }
    setSelectedTractor(tractor);
    setShowBookingModal(true);
  };

  const handleViewDetails = (tractor) => {
    toast.info(`Viewing details for ${tractor.name}`);
  };

  const handleBookingSuccess = () => {
    loadTractors();
  };

  // Calculate filter counts
const statusCounts = tractors.reduce((acc, tractor) => {
    acc[tractor.status_c] = (acc[tractor.status_c] || 0) + 1;
    return acc;
  }, {});

  const filterTabs = [
    { label: "All", value: "All", count: tractors.length },
    { label: "Available", value: "Available", count: statusCounts["Available"] || 0 },
    { label: "On Rent", value: "On Rent", count: statusCounts["On Rent"] || 0 },
    { label: "Maintenance", value: "Maintenance", count: statusCounts["Maintenance"] || 0 }
  ];

  if (loading) return <Loading text="Loading tractor fleet..." />;
  if (error) return <Error message={error} onRetry={loadTractors} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Tractor Fleet</h1>
          <p className="mt-1 text-gray-600">Manage your agricultural equipment inventory</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" icon="Download">
            Export List
          </Button>
          <Button icon="Plus">
            Add Tractor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholder="Search by tractor name or number..."
            className="flex-1 max-w-md"
          />
          
          <FilterTabs
            tabs={filterTabs}
            activeTab={selectedStatus}
            onTabChange={setSelectedStatus}
            className="flex-shrink-0"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredTractors.length} of {tractors.length} tractors
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="text-sm border-0 bg-transparent focus:ring-0 text-gray-900 font-medium">
            <option>Name</option>
            <option>Status</option>
            <option>Rate</option>
          </select>
        </div>
      </div>

      {/* Tractor Grid */}
      {filteredTractors.length === 0 ? (
        <Empty
          title={searchTerm || selectedStatus !== "All" ? "No tractors match your filters" : "No tractors found"}
          description={searchTerm || selectedStatus !== "All" 
            ? "Try adjusting your search or filter criteria."
            : "Add tractors to your fleet to start managing rentals."
          }
          action={searchTerm ? handleClearSearch : undefined}
          actionLabel={searchTerm ? "Clear Search" : undefined}
          icon="Tractor"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTractors.map((tractor) => (
            <TractorCard
              key={tractor.Id}
              tractor={tractor}
              onBook={handleBookTractor}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedTractor && (
        <BookingModal
          tractor={selectedTractor}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default TractorList;