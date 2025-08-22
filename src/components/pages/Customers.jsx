import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { customerService } from "@/services/api/customerService";
import { rentalService } from "@/services/api/rentalService";
import { tractorService } from "@/services/api/tractorService";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, newThisMonth: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tractors, setTractors] = useState([]);
  const [formData, setFormData] = useState({
    customer_name_c: '',
    farm_location_c: '',
    tractor_id_c: '',
    start_date_c: '',
    end_date_c: '',
    rental_type_c: 'daily',
    total_amount_c: '',
    payment_status_c: 'Pending'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { customers: customerData, stats: customerStats } = await customerService.getAll();
      setCustomers(customerData);
      setStats(customerStats);
      
      if (customerData.length > 0) {
        toast.success(`Loaded ${customerData.length} customers successfully`);
      }
    } catch (err) {
      setError('Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setIsLoading(false);
    }
};

  const loadTractors = async () => {
    try {
      const tractorData = await tractorService.getAll();
      setTractors(tractorData || []);
    } catch (error) {
      console.error("Error loading tractors:", error);
      toast.error("Failed to load tractors");
    }
  };

  const handleAddCustomer = () => {
    setShowModal(true);
    loadTractors();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      customer_name_c: '',
      farm_location_c: '',
      tractor_id_c: '',
      start_date_c: '',
      end_date_c: '',
      rental_type_c: 'daily',
      total_amount_c: '',
      payment_status_c: 'Pending'
    });
    setSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customer_name_c || !formData.farm_location_c || !formData.tractor_id_c || 
        !formData.start_date_c || !formData.end_date_c || !formData.total_amount_c) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      const rentalData = {
        Name: `${formData.customer_name_c} - ${formData.farm_location_c}`,
        customer_name_c: formData.customer_name_c,
        farm_location_c: formData.farm_location_c,
        tractor_id_c: parseInt(formData.tractor_id_c),
        start_date_c: formData.start_date_c,
        end_date_c: formData.end_date_c,
        rental_type_c: formData.rental_type_c,
        total_amount_c: parseFloat(formData.total_amount_c),
        payment_status_c: formData.payment_status_c
      };

      await rentalService.create([rentalData]);
      toast.success('Customer rental created successfully!');
      handleCloseModal();
      loadCustomers();
    } catch (error) {
      console.error('Error creating customer rental:', error);
      toast.error('Failed to create customer rental');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Customers</h1>
            <p className="mt-1 text-gray-600">Manage your customer database</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">Loading customers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-gray-600">Manage your customer database</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" icon="Download">
            Export List
</Button>
          <Button icon="Plus" onClick={handleAddCustomer}>
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-lg font-semibold text-primary">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-lg font-semibold text-success">{stats.active}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-lg font-semibold text-accent">{stats.newThisMonth}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      {customers.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Customer List or Empty State */}
      {customers.length === 0 ? (
        <Card className="p-12">
          <Empty
            title="No customers found"
            description="Your customer database is currently empty. Customer records will appear here when rentals are created."
            icon="Users"
          />
        </Card>
      ) : filteredCustomers.length === 0 ? (
        <Card className="p-12">
          <Empty
            title="No matching customers"
            description={`No customers found matching "${searchTerm}". Try adjusting your search terms.`}
            icon="Search"
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCustomers.map((customer, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="User" className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                      <p className="text-sm text-gray-600">
                        {customer.totalRentals} rental{customer.totalRentals !== 1 ? 's' : ''} • 
                        ₹{customer.totalAmount.toLocaleString()} total
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Locations</p>
                      <p className="font-medium text-gray-900">
                        {customer.locations.length > 0 ? customer.locations.slice(0, 2).join(', ') : 'N/A'}
                        {customer.locations.length > 2 && ` +${customer.locations.length - 2} more`}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 mb-1">Last Rental</p>
                      <p className="font-medium text-gray-900">
                        {customer.lastRental ? new Date(customer.lastRental).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 mb-1">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        customer.isActive 
                          ? 'bg-success/10 text-success' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 mb-1">Pending Payments</p>
                      <p className={`font-medium ${customer.pendingPayments > 0 ? 'text-warning' : 'text-success'}`}>
                        {customer.pendingPayments}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
</div>
      )}

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Customer</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <Input
                    name="customer_name_c"
                    value={formData.customer_name_c}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Location *
                  </label>
                  <Input
                    name="farm_location_c"
                    value={formData.farm_location_c}
                    onChange={handleInputChange}
                    placeholder="Enter farm location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Tractor *
                  </label>
                  <Select
                    name="tractor_id_c"
                    value={formData.tractor_id_c}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose a tractor</option>
                    {tractors.map((tractor) => (
                      <option key={tractor.Id} value={tractor.Id}>
                        {tractor.Name} - #{tractor.number_c}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <Input
                      type="date"
                      name="start_date_c"
                      value={formData.start_date_c}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <Input
                      type="date"
                      name="end_date_c"
                      value={formData.end_date_c}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Type *
                  </label>
                  <Select
                    name="rental_type_c"
                    value={formData.rental_type_c}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="hourly">Hourly</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount *
                  </label>
                  <Input
                    type="number"
                    name="total_amount_c"
                    value={formData.total_amount_c}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status *
                  </label>
                  <Select
                    name="payment_status_c"
                    value={formData.payment_status_c}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </Select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    icon={submitting ? "Loader" : "Plus"}
                  >
                    {submitting ? 'Creating...' : 'Create Customer'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;