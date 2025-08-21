import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import ReactApexChart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { rentalService } from "@/services/api/rentalService";
import { tractorService } from "@/services/api/tractorService";
import { paymentService } from "@/services/api/paymentService";

const Reports = () => {
  const [rentals, setRentals] = useState([]);
  const [tractors, setTractors] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("thisMonth");

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [rentalsData, tractorsData, paymentsData] = await Promise.all([
        rentalService.getAll(),
        tractorService.getAll(),
        paymentService.getAll()
      ]);
      
      setRentals(rentalsData);
      setTractors(tractorsData);
      setPayments(paymentsData);
    } catch (err) {
      setError("Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Get date range
  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "lastMonth":
        return { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };
      case "last3Months":
        return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now) };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  // Filter data by date range
  const filterByDateRange = (data, dateField = "startDate") => {
    const { start, end } = getDateRange();
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  // Calculate revenue data for chart
  const getRevenueChartData = () => {
    const filteredRentals = filterByDateRange(rentals);
    const filteredPayments = filterByDateRange(payments, "paidDate").filter(p => p.status === "Completed");
    
    // Group by month
    const monthlyRevenue = {};
    filteredPayments.forEach(payment => {
      const month = format(new Date(payment.paidDate), "MMM yyyy");
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + payment.amount;
    });

    const categories = Object.keys(monthlyRevenue).sort();
    const data = categories.map(month => monthlyRevenue[month]);

    return {
      categories,
      series: [{
        name: "Revenue",
        data: data
      }]
    };
  };

  // Calculate tractor utilization data
  const getTractorUtilizationData = () => {
    const filteredRentals = filterByDateRange(rentals);
    
    const utilizationData = tractors.map(tractor => {
      const tractorRentals = filteredRentals.filter(r => r.tractorId === tractor.Id);
      const revenue = tractorRentals.reduce((sum, rental) => sum + rental.totalAmount, 0);
      return {
        name: tractor.name,
        revenue,
        bookings: tractorRentals.length
      };
    }).sort((a, b) => b.revenue - a.revenue);

    return {
      categories: utilizationData.map(t => t.name),
      series: [{
        name: "Revenue",
        data: utilizationData.map(t => t.revenue)
      }]
    };
  };

  // Calculate summary stats
  const getSummaryStats = () => {
    const filteredRentals = filterByDateRange(rentals);
    const filteredPayments = filterByDateRange(payments, "paidDate").filter(p => p.status === "Completed");
    
    const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalBookings = filteredRentals.length;
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const utilizationRate = tractors.length > 0 ? (filteredRentals.length / tractors.length) * 100 : 0;

    return {
      totalRevenue,
      totalBookings,
      averageBookingValue,
      utilizationRate
    };
  };

  const revenueChart = getRevenueChartData();
  const utilizationChart = getTractorUtilizationData();
  const stats = getSummaryStats();

  const revenueChartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false }
    },
    colors: ["#2D5016"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { categories: revenueChart.categories },
    yaxis: {
      labels: {
        formatter: (value) => `₹${(value / 1000).toFixed(0)}K`
      }
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3
    }
  };

  const utilizationChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false }
    },
    colors: ["#7CB342"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4
      }
    },
    xaxis: { categories: utilizationChart.categories },
    yaxis: {
      labels: {
        formatter: (value) => `₹${(value / 1000).toFixed(0)}K`
      }
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3
    }
  };

  if (loading) return <Loading text="Loading reports..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-gray-600">Analyze your rental business performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-40"
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
          </Select>
          <Button variant="outline" icon="Download">
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="IndianRupee" className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-success">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-primary">{stats.totalBookings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Booking Value</p>
              <p className="text-2xl font-bold text-accent">₹{Math.round(stats.averageBookingValue).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Utilization Rate</p>
              <p className="text-2xl font-bold text-secondary">{stats.utilizationRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary" />
          </div>
          <ReactApexChart
            options={revenueChartOptions}
            series={revenueChart.series}
            type="area"
            height={350}
          />
        </Card>

        {/* Tractor Performance Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tractor Performance</h3>
            <ApperIcon name="BarChart3" className="w-5 h-5 text-secondary" />
          </div>
          <ReactApexChart
            options={utilizationChartOptions}
            series={utilizationChart.series}
            type="bar"
            height={350}
          />
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Tractors */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Tractors</h3>
          <div className="space-y-4">
            {utilizationChart.categories.slice(0, 5).map((name, index) => {
              const tractor = tractors.find(t => t.name === name);
              const revenue = utilizationChart.series[0].data[index];
              return (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{name}</p>
                      <p className="text-sm text-gray-500">#{tractor?.number || "N/A"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">₹{revenue.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Period Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Tractors</span>
              <span className="font-medium text-gray-900">{tractors.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Active Rentals</span>
              <span className="font-medium text-gray-900">{filterByDateRange(rentals).length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Completed Payments</span>
              <span className="font-medium text-gray-900">
                {filterByDateRange(payments, "paidDate").filter(p => p.status === "Completed").length}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Pending Payments</span>
              <span className="font-medium text-warning">
                {filterByDateRange(payments, "paidDate").filter(p => p.status === "Pending").length}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Collection Rate</span>
              <span className="font-medium text-success">
                {payments.length > 0 
                  ? Math.round((payments.filter(p => p.status === "Completed").length / payments.length) * 100)
                  : 0
                }%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;