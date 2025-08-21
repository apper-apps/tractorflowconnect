import paymentsData from "@/services/mockData/payments.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const paymentService = {
  async getAll() {
    await delay(300);
    return [...paymentsData];
  },

  async getById(id) {
    await delay(200);
    const payment = paymentsData.find(p => p.Id === parseInt(id));
    if (!payment) {
      throw new Error("Payment not found");
    }
    return { ...payment };
  },

  async create(payment) {
    await delay(400);
    const maxId = Math.max(...paymentsData.map(p => p.Id));
    const newPayment = {
      ...payment,
      Id: maxId + 1
    };
    paymentsData.push(newPayment);
    return { ...newPayment };
  },

  async update(id, updates) {
    await delay(350);
    const index = paymentsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Payment not found");
    }
    paymentsData[index] = { ...paymentsData[index], ...updates };
    return { ...paymentsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = paymentsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Payment not found");
    }
    const deleted = paymentsData.splice(index, 1)[0];
    return { ...deleted };
  }
};