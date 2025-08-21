import tractorsData from "@/services/mockData/tractors.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const tractorService = {
  async getAll() {
    await delay(300);
    return [...tractorsData];
  },

  async getById(id) {
    await delay(200);
    const tractor = tractorsData.find(t => t.Id === parseInt(id));
    if (!tractor) {
      throw new Error("Tractor not found");
    }
    return { ...tractor };
  },

  async create(tractor) {
    await delay(400);
    const maxId = Math.max(...tractorsData.map(t => t.Id));
    const newTractor = {
      ...tractor,
      Id: maxId + 1
    };
    tractorsData.push(newTractor);
    return { ...newTractor };
  },

  async update(id, updates) {
    await delay(350);
    const index = tractorsData.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Tractor not found");
    }
    tractorsData[index] = { ...tractorsData[index], ...updates };
    return { ...tractorsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = tractorsData.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Tractor not found");
    }
    const deleted = tractorsData.splice(index, 1)[0];
    return { ...deleted };
  }
};