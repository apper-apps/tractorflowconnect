import { toast } from 'react-toastify';
import { toast } from 'react-toastify';
export const rentalService = {
  async getAll() {
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
          { field: { Name: "payment_status_c" } },
          { field: { Name: "Tags" } }
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
        console.error("Error fetching rentals:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching rentals:", error);
        toast.error("Failed to load rentals");
      }
      return [];
    }
  },

  async getById(id) {
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
          { field: { Name: "payment_status_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById("rental_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching rental with ID ${id}:`, error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching rental:", error);
        toast.error("Failed to load rental");
      }
      return null;
    }
  },

async create(rental) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

// Only include Updateable fields and ensure proper data formatting
      const rentalData = {
        Name: rental.Name || `Rental for ${rental.customer_name_c}`,
        tractor_id_c: parseInt(rental.tractor_id_c),
        customer_name_c: rental.customer_name_c,
        farm_location_c: rental.farm_location_c,
        start_date_c: rental.start_date_c,
        end_date_c: rental.end_date_c,
        rental_type_c: rental.rental_type_c || "daily",
        total_amount_c: parseInt(rental.total_amount_c) || 0,
        payment_status_c: rental.payment_status_c || "Pending",
        Tags: rental.Tags || ""
      };

      const params = {
        records: [rentalData]
      };

      const response = await apperClient.createRecord("rental_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} rental records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Rental created successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating rental:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating rental:", error);
        toast.error("Failed to create rental");
      }
      return null;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

// Only include Updateable fields
      const updateData = {
        Id: parseInt(id),
        ...(updates.Name && { Name: updates.Name }),
        ...(updates.tractor_id_c && { tractor_id_c: parseInt(updates.tractor_id_c) }),
        ...(updates.customer_name_c && { customer_name_c: updates.customer_name_c }),
        ...(updates.farm_location_c && { farm_location_c: updates.farm_location_c }),
        ...(updates.start_date_c && { start_date_c: updates.start_date_c }),
        ...(updates.end_date_c && { end_date_c: updates.end_date_c }),
        ...(updates.rental_type_c && { rental_type_c: updates.rental_type_c }),
        ...(updates.total_amount_c && { total_amount_c: parseInt(updates.total_amount_c) }),
        ...(updates.payment_status_c && { payment_status_c: updates.payment_status_c }),
        ...(updates.Tags !== undefined && { Tags: updates.Tags })
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("rental_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} rental records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Rental updated successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating rental:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating rental:", error);
        toast.error("Failed to update rental");
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("rental_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} rental records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Rental deleted successfully!");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting rental:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting rental:", error);
        toast.error("Failed to delete rental");
      }
      return false;
    }
  }
};