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
    customerName: "",
    farmLocation: "",
    startDate: "",
    endDate: "",
    rentalType: "daily" // daily or hourly
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [duration, setDuration] = useState({ days: 0, hours: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end > start) {
        const hours = differenceInHours(end, start);
        const days = Math.ceil(hours / 24);
        
        setDuration({ days, hours });
        
        if (formData.rentalType === "daily") {
          setTotalAmount(days * tractor.dailyRate);
        } else {
          setTotalAmount(hours * tractor.hourlyRate);
        }
      } else {
        setDuration({ days: 0, hours: 0 });
        setTotalAmount(0);
      }
    }
  }, [formData.startDate, formData.endDate, formData.rentalType, tractor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.farmLocation || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);
    try {
      const rental = {
        tractorId: tractor.Id,
        customerName: formData.customerName,
        farmLocation: formData.farmLocation,
        startDate: formData.startDate,
        endDate: formData.endDate,
        rentalType: formData.rentalType,
        totalAmount,
        paymentStatus: "Pending"
      };

      await rentalService.create(rental);
      toast.success(`Booking confirmed for ${tractor.name}!`);
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        customerName: "",
        farmLocation: "",
        startDate: "",
        endDate: "",
        rentalType: "daily"
      });
    } catch (error) {
      toast.error("Failed to create booking");
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
                <h4 className="font-medium text-gray-900">{tractor.name}</h4>
                <p className="text-sm text-gray-600">#{tractor.number}</p>
                <p className="text-sm text-primary">₹{tractor.hourlyRate}/hr • ₹{tractor.dailyRate}/day</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Customer Name *"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Enter customer name"
              required
            />

            <Input
              label="Farm Location *"
              name="farmLocation"
              value={formData.farmLocation}
              onChange={handleInputChange}
              placeholder="Enter farm address"
              required
            />

            <Select
              label="Rental Type *"
              name="rentalType"
              value={formData.rentalType}
              onChange={handleInputChange}
              required
            >
              <option value="daily">Daily Rental</option>
              <option value="hourly">Hourly Rental</option>
            </Select>

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
            {totalAmount > 0 && (
              <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                <h5 className="font-medium text-gray-900">Rental Summary</h5>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900">
                      {formData.rentalType === "daily" 
                        ? `${duration.days} day${duration.days !== 1 ? "s" : ""}`
                        : `${duration.hours} hour${duration.hours !== 1 ? "s" : ""}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="text-gray-900">
                      ₹{formData.rentalType === "daily" ? tractor.dailyRate : tractor.hourlyRate}
                      /{formData.rentalType === "daily" ? "day" : "hr"}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-primary border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

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
                disabled={totalAmount === 0}
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