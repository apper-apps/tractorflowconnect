import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StatCard from "@/components/molecules/StatCard";
import TractorCard from "@/components/molecules/TractorCard";
import BookingModal from "@/components/organisms/BookingModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { tractorService } from "@/services/api/tractorService";
import { rentalService } from "@/services/api/rentalService";

const Dashboard = () => {
  const [tractors, setTractors] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [tractorsData, rentalsData] = await Promise.all([
        tractorService.getAll(),
        rentalService.getAll()
      ]);
      
      setTractors(tractorsData);
      setRentals(rentalsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBookTractor = (tractor) => {
    setSelectedTractor(tractor);
    setShowBookingModal(true);
  };

  const handleViewDetails = (tractor) => {
    toast.info(`Viewing details for ${tractor.name}`);
  };

  const handleBookingSuccess = () => {
    loadData();
  };

  // Calculate stats
  const stats = {
    totalTractors: tractors.length,
availableTractors: tractors.filter(t => t.status_c === "Available").length,
    activeRentals: rentals.filter(r => r.payment_status_c === "Pending").length,
    todayRevenue: rentals
      .filter(r => new Date(r.start_date_c).toDateString() === new Date().toDateString())
      .reduce((sum, r) => sum + (r.total_amount_c || 0), 0)
  };

  if (loading) return <Loading text="Loading dashboard..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage your tractor rental operations</p>
        </div>
<div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" icon="Download">
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tractors"
          value={stats.totalTractors}
          icon="Tractor"
          className="bg-gradient-to-br from-primary/5 to-secondary/10"
        />
        <StatCard
          title="Available Now"
          value={stats.availableTractors}
          icon="CheckCircle"
          trend="up"
          trendValue={`${Math.round((stats.availableTractors / stats.totalTractors) * 100)}%`}
          className="bg-gradient-to-br from-success/5 to-success/10"
        />
        <StatCard
          title="Active Rentals"
          value={stats.activeRentals}
          icon="Clock"
          className="bg-gradient-to-br from-warning/5 to-warning/10"
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toLocaleString()}`}
          icon="IndianRupee"
          trend="up"
          trendValue="+12%"
          className="bg-gradient-to-br from-accent/5 to-accent/10"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" icon="Calendar" className="justify-start">
            Schedule Maintenance
          </Button>
          <Button variant="outline" icon="FileText" className="justify-start">
            Generate Invoice
          </Button>
          <Button variant="outline" icon="Users" className="justify-start">
            Add Customer
          </Button>
        </div>
      </div>

      {/* Fleet Overview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Fleet Overview</h2>
          <Button variant="ghost" icon="ArrowRight">
            View All Tractors
          </Button>
        </div>

        {tractors.length === 0 ? (
          <Empty
            title="No tractors available"
            description="Add tractors to your fleet to start managing rentals."
            actionLabel="Add Tractor"
            icon="Tractor"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tractors.slice(0, 6).map((tractor) => (
              <TractorCard
                key={tractor.Id}
                tractor={tractor}
                onBook={handleBookTractor}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {rentals.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Activity" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rentals.slice(0, 5).map((rental) => (
              <div key={rental.Id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="Calendar" className="w-4 h-4 text-primary" />
                  </div>
                  <div>
<p className="text-sm font-medium text-gray-900">
                      {rental.customer_name_c} booked a tractor
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(rental.start_date_c).toLocaleDateString()} • {rental.farm_location_c}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₹{rental.total_amount_c?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{rental.payment_status_c}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default Dashboard;