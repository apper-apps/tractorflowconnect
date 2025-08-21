import rentalsData from "@/services/mockData/rentals.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const rentalService = {
  async getAll() {
    await delay(350);
    return [...rentalsData];
  },

  async getById(id) {
    await delay(200);
    const rental = rentalsData.find(r => r.Id === parseInt(id));
    if (!rental) {
      throw new Error("Rental not found");
    }
    return { ...rental };
  },

  async create(rental) {
    await delay(450);
    const maxId = Math.max(...rentalsData.map(r => r.Id));
    const newRental = {
      ...rental,
      Id: maxId + 1
    };
    rentalsData.push(newRental);
    return { ...newRental };
  },

  async update(id, updates) {
    await delay(400);
    const index = rentalsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Rental not found");
    }
    rentalsData[index] = { ...rentalsData[index], ...updates };
    return { ...rentalsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = rentalsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Rental not found");
    }
    const deleted = rentalsData.splice(index, 1)[0];
    return { ...deleted };
  }
};