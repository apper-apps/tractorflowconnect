import { toast } from 'react-toastify';
import { toast } from 'react-toastify';
export const tractorService = {
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
          { field: { Name: "number_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "hourly_rate_c" } },
          { field: { Name: "daily_rate_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords("tractor_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tractors:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching tractors:", error);
        toast.error("Failed to load tractors");
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
          { field: { Name: "number_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "hourly_rate_c" } },
          { field: { Name: "daily_rate_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById("tractor_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching tractor with ID ${id}:`, error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching tractor:", error);
        toast.error("Failed to load tractor");
      }
      return null;
    }
  },

  async create(tractor) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

// Only include Updateable fields
      const tractorData = {
        Name: tractor.Name,
        number_c: tractor.number_c,
        status_c: tractor.status_c,
        hourly_rate_c: parseInt(tractor.hourly_rate_c),
        daily_rate_c: parseInt(tractor.daily_rate_c),
        image_url_c: tractor.image_url_c || "",
        Tags: tractor.Tags || ""
      };

      const params = {
        records: [tractorData]
      };

      const response = await apperClient.createRecord("tractor_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tractor records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Tractor created successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating tractor:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating tractor:", error);
        toast.error("Failed to create tractor");
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
        ...(updates.number_c && { number_c: updates.number_c }),
        ...(updates.status_c && { status_c: updates.status_c }),
        ...(updates.hourly_rate_c && { hourly_rate_c: parseInt(updates.hourly_rate_c) }),
        ...(updates.daily_rate_c && { daily_rate_c: parseInt(updates.daily_rate_c) }),
        ...(updates.image_url_c !== undefined && { image_url_c: updates.image_url_c }),
        ...(updates.Tags !== undefined && { Tags: updates.Tags })
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("tractor_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} tractor records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Tractor updated successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating tractor:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating tractor:", error);
        toast.error("Failed to update tractor");
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

      const response = await apperClient.deleteRecord("tractor_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} tractor records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Tractor deleted successfully!");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting tractor:", error?.response?.data?.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting tractor:", error);
        toast.error("Failed to delete tractor");
      }
      return false;
    }
  }
};