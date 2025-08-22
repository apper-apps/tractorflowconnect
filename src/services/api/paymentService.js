import { toast } from 'react-toastify';
import { toast } from 'react-toastify';
export const paymentService = {
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
          { field: { Name: "rental_id_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "paid_date_c" } },
          { field: { Name: "method_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "paid_date_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("payment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching payments:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching payments:", error);
        toast.error("Failed to load payments");
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
          { field: { Name: "rental_id_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "paid_date_c" } },
          { field: { Name: "method_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById("payment_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching payment with ID ${id}:`, error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching payment:", error);
        toast.error("Failed to load payment");
      }
      return null;
    }
  },

  async create(payment) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

// Only include Updateable fields and ensure proper data formatting
      const paymentData = {
        Name: payment.Name || `Payment for ${payment.rental_id_c}`,
        rental_id_c: parseInt(payment.rental_id_c),
        amount_c: parseInt(payment.amount_c),
        paid_date_c: payment.paid_date_c,
        method_c: payment.method_c,
        status_c: payment.status_c,
        Tags: payment.Tags || ""
      };

      const params = {
        records: [paymentData]
      };

      const response = await apperClient.createRecord("payment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} payment records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Payment created successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating payment:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating payment:", error);
        toast.error("Failed to create payment");
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
        ...(updates.rental_id_c && { rental_id_c: parseInt(updates.rental_id_c) }),
        ...(updates.amount_c && { amount_c: parseInt(updates.amount_c) }),
        ...(updates.paid_date_c && { paid_date_c: updates.paid_date_c }),
        ...(updates.method_c && { method_c: updates.method_c }),
        ...(updates.status_c && { status_c: updates.status_c }),
        ...(updates.Tags !== undefined && { Tags: updates.Tags })
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("payment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} payment records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Payment updated successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating payment:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating payment:", error);
        toast.error("Failed to update payment");
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

      const response = await apperClient.deleteRecord("payment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} payment records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Payment deleted successfully!");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting payment:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting payment:", error);
        toast.error("Failed to delete payment");
      }
      return false;
    }
  }
};