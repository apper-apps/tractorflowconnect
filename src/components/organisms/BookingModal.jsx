import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { rentalService } from "@/services/api/rentalService";
import { format, differenceInHours, differenceInDays } from "date-fns";

const BookingModal = ({ tractor, isOpen, onClose, onSuccess }) => {
const [formData, setFormData] = useState({
    customerId: "",
    driverId: "",
    farmLocation: "",
    startDate: "",
    endDate: "",
    paymentAmount: ""
  });
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [totalRent, setTotalRent] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(false);

// Load customers and drivers on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock data for customers and drivers
        const mockCustomers = [
          { Id: 1, name: "Rajesh Kumar", location: "Village Rampur" },
          { Id: 2, name: "Suresh Patel", location: "Kisan Nagar" },
          { Id: 3, name: "Mahesh Singh", location: "Krishi Colony" },
          { Id: 4, name: "Ramesh Yadav", location: "Farmer's Hub" }
        ];
        
        const mockDrivers = [
          { Id: 1, name: "Vikram Singh", experience: "5 years" },
          { Id: 2, name: "Arjun Kumar", experience: "8 years" },
          { Id: 3, name: "Deepak Sharma", experience: "3 years" },
          { Id: 4, name: "Ravi Patel", experience: "10 years" }
        ];
        
        setCustomers(mockCustomers);
        setDrivers(mockDrivers);
      } catch (error) {
        toast.error("Failed to load customers and drivers");
      }
    };
    
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

// Calculate rent based on hours
  useEffect(() => {
    if (formData.startDate && formData.endDate && tractor?.hourly_rate_c) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end > start) {
        const hours = differenceInHours(end, start);
        const rent = hours * tractor.hourly_rate_c;
        
        setTotalHours(hours);
        setTotalRent(rent);
      } else {
        setTotalHours(0);
        setTotalRent(0);
      }
    }
  }, [formData.startDate, formData.endDate, tractor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.driverId || !formData.farmLocation || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    const paymentAmount = parseFloat(formData.paymentAmount) || 0;
    if (paymentAmount < 0) {
      toast.error("Payment amount cannot be negative");
      return;
    }

    if (paymentAmount > totalRent) {
      toast.error("Payment amount cannot exceed total rent");
      return;
    }

    setLoading(true);
    try {
      const selectedCustomer = customers.find(c => c.Id == formData.customerId);
      const selectedDriver = drivers.find(d => d.Id == formData.driverId);
      
const rental = {
        Name: `Rental for ${selectedCustomer?.name || "Customer"}`,
        tractor_id_c: tractor.Id,
        customer_name_c: selectedCustomer?.name || "",
customer_name_c: formData.customerId, // This should be the customer name, not ID
        farm_location_c: formData.farmLocation,
        start_date_c: new Date(formData.startDate).toISOString(),
        end_date_c: new Date(formData.endDate).toISOString(),
        rental_type_c: "hourly",
        total_amount_c: totalRent,
        payment_status_c: paymentAmount >= totalRent ? "Paid" : paymentAmount > 0 ? "Partial" : "Pending"
      };

      await rentalService.create(rental);
      toast.success(`Rent entry created for ${tractor.Name}! Total: ₹${totalRent.toLocaleString()}`);
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        customerId: "",
        driverId: "",
        farmLocation: "",
        startDate: "",
        endDate: "",
        paymentAmount: ""
      });
    } catch (error) {
      toast.error("Failed to create rent entry");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Book Tractor</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Tractor Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Tractor" className="w-6 h-6 text-white" />
              </div>
              <div>
<h4 className="font-medium text-gray-900">{tractor.Name}</h4>
                <p className="text-sm text-gray-600">#{tractor.number_c}</p>
                <p className="text-sm text-primary">₹{tractor.hourly_rate_c}/hr • ₹{tractor.daily_rate_c}/day</p>
              </div>
            </div>
          </div>

<form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Customer Name *"
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                placeholder="Enter customer name"
                required
              />
            </div>

            <Input
              label="Farm Location *"
              name="farmLocation"
              value={formData.farmLocation}
              onChange={handleInputChange}
              placeholder="Enter farm address or location"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleInputChange}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                required
              />

              <Input
                label="End Date *"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate}
                required
              />
            </div>

            {/* Calculation Summary */}
{totalRent > 0 && (
              <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                <h5 className="font-medium text-gray-900">Auto-Calculated Rent</h5>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900">
                      {totalHours} hour{totalHours !== 1 ? "s" : ""}
                    </span>
                  </div>
<div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="text-gray-900">
                      ₹{tractor.hourly_rate_c || 0}/hour
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-primary border-t pt-2">
                    <span>Total Rent:</span>
                    <span>₹{totalRent.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Payment Amount"
              name="paymentAmount"
              type="number"
              value={formData.paymentAmount}
              onChange={handleInputChange}
              placeholder="Enter payment amount (optional)"
              min="0"
              max={totalRent}
              step="0.01"
              helper={`Maximum: ₹${totalRent.toLocaleString()}`}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={loading}
disabled={totalRent === 0}
              >
                Confirm Booking
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default BookingModal;