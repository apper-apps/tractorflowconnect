import { toast } from 'react-toastify';
export const customerService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        fields: [
          { field: { Name: "customer_name_c" } },
          { field: { Name: "farm_location_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "payment_status_c" } },
          { field: { Name: "total_amount_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          { fieldName: "customer_name_c", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords("rental_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { customers: [], stats: { total: 0, active: 0, newThisMonth: 0 } };
      }

      const rentals = response.data || [];
      
      // Extract unique customers and their data
      const customerMap = new Map();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      rentals.forEach(rental => {
        if (rental.customer_name_c) {
          const customerName = rental.customer_name_c;
          
          if (!customerMap.has(customerName)) {
            customerMap.set(customerName, {
              name: customerName,
              totalRentals: 0,
              totalAmount: 0,
              lastRental: null,
              locations: new Set(),
              isActive: false,
              isNewThisMonth: false,
              pendingPayments: 0
            });
          }
          
          const customer = customerMap.get(customerName);
          customer.totalRentals += 1;
          customer.totalAmount += rental.total_amount_c || 0;
          
          if (rental.farm_location_c) {
            customer.locations.add(rental.farm_location_c);
          }
          
          if (rental.payment_status_c === 'Pending' || rental.payment_status_c === 'Overdue') {
            customer.pendingPayments += 1;
          }
          
          // Check if customer is active (has recent rentals)
          const rentalDate = new Date(rental.start_date_c);
          if (!customer.lastRental || rentalDate > new Date(customer.lastRental)) {
            customer.lastRental = rental.start_date_c;
          }
          
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          if (rentalDate > sixMonthsAgo) {
            customer.isActive = true;
          }
          
          // Check if customer is new this month
          const createdDate = new Date(rental.CreatedOn);
          if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
            customer.isNewThisMonth = true;
          }
        }
      });
      
      // Convert map to array and format locations
      const customers = Array.from(customerMap.values()).map(customer => ({
        ...customer,
        locations: Array.from(customer.locations)
      }));
      
      // Calculate statistics
      const stats = {
        total: customers.length,
        active: customers.filter(c => c.isActive).length,
        newThisMonth: customers.filter(c => c.isNewThisMonth).length
      };
      
      return { customers, stats };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching customers:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers");
      }
      return { customers: [], stats: { total: 0, active: 0, newThisMonth: 0 } };
    }
  },

  async getCustomerRentals(customerName) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "tractor_id_c" } },
          { field: { Name: "customer_name_c" } },
          { field: { Name: "farm_location_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "rental_type_c" } },
          { field: { Name: "total_amount_c" } },
          { field: { Name: "payment_status_c" } }
        ],
        where: [
          {
            FieldName: "customer_name_c",
            Operator: "EqualTo",
            Values: [customerName]
          }
        ],
        orderBy: [
          { fieldName: "start_date_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("rental_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching rentals for customer ${customerName}:`, error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching customer rentals:", error);
        toast.error("Failed to load customer rentals");
      }
      return [];
    }
  },

  async getCustomerStats() {
    try {
      const { customers, stats } = await this.getAll();
      return stats;
    } catch (error) {
      console.error("Error fetching customer stats:", error);
      return { total: 0, active: 0, newThisMonth: 0 };
    }
  }
};