import { Layout } from '@/components/Layout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatIndianCurrency } from '@/lib/utils';
import { getCategoryColorClass } from '@/lib/utils';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  IndianRupee,
  HomeIcon, 
  ShoppingBagIcon, 
  CarIcon, 
  UtensilsIcon, 
  HeartIcon, 
  FilmIcon, 
  LightbulbIcon, 
  TagIcon
} from 'lucide-react';

// Colors for the charts - diverse, vibrant colors for Indian theme
const COLORS = ['#0891B2', '#0E7490', '#059669', '#047857', '#B45309', '#92400E', '#BE123C', '#9F1239', '#1D4ED8', '#1E40AF', '#7E22CE', '#6B21A8'];

export default function IndianDashboard() {
  const queryClient = useQueryClient();
  
  // Force prefetch data on component mount
  useEffect(() => {
    const prefetchData = async () => {
      await queryClient.prefetchQuery({
        queryKey: ['/api/indian-expenses'],
        staleTime: 0
      });
      
      await queryClient.prefetchQuery({
        queryKey: ['/api/salaries'],
        staleTime: 0
      });
    };
    
    prefetchData();
  }, [queryClient]);

  // Fetch Indian expenses with improved settings
  const { data: expenses = [] } = useQuery<any[]>({
    queryKey: ['/api/indian-expenses'],
    initialData: [],
    staleTime: 0, // Consider data stale immediately for refetching
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true // Refetch when window regains focus
  });
  
  // Fetch salaries with improved settings
  const { data: salaries = [] } = useQuery<any[]>({
    queryKey: ['/api/salaries'],
    initialData: [],
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
  
  // Use all expenses, without date filtering
  const filteredExpenses = expenses;
  
  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  
  // Calculate total income - using salary data
  const totalIncome = salaries.reduce((sum, salary) => sum + Number(salary.amount), 0);
  
  // Calculate expenses by category
  const expensesByCategory = filteredExpenses.reduce((acc: Record<string, number>, exp) => {
    const category = exp.category;
    if (!acc[category]) acc[category] = 0;
    acc[category] += Number(exp.amount);
    return acc;
  }, {});
  
  // Function to get appropriate icon for category
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('rent') || lowerCategory.includes('home') || lowerCategory.includes('house')) {
      return <HomeIcon className="h-4 w-4 text-white" />;
    }
    if (lowerCategory.includes('food') || lowerCategory.includes('grocery') || lowerCategory.includes('groceries')) {
      return <ShoppingBagIcon className="h-4 w-4 text-white" />;
    }
    if (lowerCategory.includes('transport') || lowerCategory.includes('car') || lowerCategory.includes('fuel')) {
      return <CarIcon className="h-4 w-4 text-white" />;
    }
    if (lowerCategory.includes('restaurant') || lowerCategory.includes('dining')) {
      return <UtensilsIcon className="h-4 w-4 text-white" />;
    }
    if (lowerCategory.includes('health') || lowerCategory.includes('medical')) {
      return <HeartIcon className="h-4 w-4 text-white" />;
    }
    if (lowerCategory.includes('entertainment') || lowerCategory.includes('movie') || lowerCategory.includes('film')) {
      return <FilmIcon className="h-4 w-4 text-white" />;
    }
    if (lowerCategory.includes('utility') || lowerCategory.includes('utilities') || lowerCategory.includes('electric')) {
      return <LightbulbIcon className="h-4 w-4 text-white" />;
    }
    
    // Default icon for other categories
    return <TagIcon className="h-4 w-4 text-white" />;
  };
  
  // Prepare data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(([category, amount], index) => ({
    name: category,
    value: amount,
    color: COLORS[index % COLORS.length]
  }));
  
  // Function to get last n months
  const getLastNMonths = (n: number) => {
    const result = [];
    const now = new Date();
    for (let i = 0; i < n; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push({
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
      });
    }
    return result;
  };
  
  // Prepare data for bar chart - last 6 months
  const last6Months = getLastNMonths(6).reverse();
  
  const barChartData = last6Months.map(({ month, year }) => {
    const monthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === new Date(`${month} 1, 2000`).getMonth() && 
             expDate.getFullYear() === year;
    }).reduce((sum, exp) => sum + Number(exp.amount), 0);
    
    return {
      name: `${month} ${year}`,
      expenses: monthExpenses,
    };
  });
  
  return (
    <Layout>
      <div className="max-w-5xl ml-0 pl-4">
        <h1 className="text-xl font-semibold mb-6">Indian Finance - Dashboard (₹)</h1>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card className="border-t-4 border-t-teal-700">
            <CardHeader className="bg-teal-700 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Expenses (₹)</CardTitle>
              <div className="p-2 rounded-full bg-teal-800">
                <ArrowDownIcon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-teal-900">{formatIndianCurrency(totalExpenses)}</div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                  {filteredExpenses.length} expenses total
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Category Totals Card */}
        <Card className="mb-6 border-l-4 border-l-amber-600">
          <CardHeader className="bg-amber-700">
            <CardTitle className="text-white">Category Totals (₹)</CardTitle>
            <CardDescription className="text-amber-100">Total spent in each expense category (₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(expensesByCategory).map(([category, amount], index) => (
                <div key={category} className="border border-amber-200 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      >
                        {getCategoryIcon(category)}
                      </div>
                      <span className="font-medium text-amber-900">{category}</span>
                    </div>
                    <span className="text-lg font-semibold text-amber-800">{formatIndianCurrency(amount)}</span>
                  </div>

                  {/* Progress bar for % of total expenses */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-amber-600">% of expenses</span>
                      <span className="font-medium px-2 py-0.5 rounded-full" 
                        style={{ 
                          backgroundColor: totalExpenses > 0 && (amount / totalExpenses > 0.25) ? '#FEF2F2' : '#FEF3C7',
                          color: totalExpenses > 0 && (amount / totalExpenses > 0.25) ? '#B91C1C' : '#92400E'
                        }}>
                        {totalExpenses > 0 ? `${(amount / totalExpenses * 100).toFixed(1)}%` : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{
                          width: `${Math.round(amount / totalExpenses * 100)}%`,
                          backgroundColor: totalExpenses > 0 && (amount / totalExpenses > 0.25) ? '#DC2626' : '#D97706'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {Object.keys(expensesByCategory).length === 0 && (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  <p>No expense data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* Expenses by Category Pie Chart */}
          <Card className="col-span-1 border-r-4 border-r-emerald-600 shadow-md">
            <CardHeader className="bg-emerald-700">
              <CardTitle className="text-white">Expenses by Category (₹)</CardTitle>
              <CardDescription className="text-emerald-100">
                Distribution of expenses across different categories
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2 bg-gradient-to-b from-emerald-50/50 to-white">
              <div className="h-80">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatIndianCurrency(value)}
                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #D1FAE5' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-emerald-500">No data to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Monthly Expenses Bar Chart */}
          <Card className="col-span-1 border-b-4 border-b-cyan-600 shadow-md">
            <CardHeader className="bg-cyan-700">
              <CardTitle className="text-white">Monthly Expenses (₹)</CardTitle>
              <CardDescription className="text-cyan-100">
                Expenses over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-gradient-to-b from-cyan-50/50 to-white">
              <div className="h-80">
                {barChartData.some(data => data.expenses > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECFEFF" />
                      <XAxis dataKey="name" stroke="#0E7490" />
                      <YAxis 
                        tickFormatter={(value) => 
                          value === 0 ? '0' : 
                          value >= 1000 ? `${(value / 1000).toFixed(0)}k` : 
                          value.toString()
                        }
                        stroke="#0E7490"
                      />
                      <Tooltip 
                        formatter={(value: number) => formatIndianCurrency(value)}
                        labelFormatter={(label) => `Month: ${label}`}
                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #CFFAFE' }}
                      />
                      <Bar dataKey="expenses" fill="#0891B2" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-cyan-500">No data to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Expenses List */}
        <Card className="border-t-4 border-r-4 border-t-blue-600 border-r-blue-600 shadow-md">
          <CardHeader className="bg-blue-700">
            <CardTitle className="text-white">Recent Expenses (₹)</CardTitle>
            <CardDescription className="text-blue-100">
              Your latest 5 Indian expenses
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-gradient-to-br from-blue-50/30 to-white">
            <div className="space-y-4">
              {filteredExpenses.slice(0, 5).map((expense, index) => (
                <div key={expense.id} className="flex items-center p-3 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors duration-200">
                  <div 
                    className="flex items-center justify-center h-12 w-12 rounded-full mr-3 shadow-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div className="ml-2 space-y-1">
                    <p className="text-sm font-semibold text-blue-900">{expense.category}</p>
                    <p className="text-xs text-blue-700">
                      {new Date(expense.date).toLocaleDateString()}
                      {expense.description && 
                        <span className="ml-1 px-2 py-0.5 bg-blue-100 rounded-full text-blue-800">
                          {expense.description}
                        </span>
                      }
                    </p>
                  </div>
                  <div className="ml-auto font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-lg">
                    {formatIndianCurrency(expense.amount)}
                  </div>
                </div>
              ))}
              
              {filteredExpenses.length === 0 && (
                <div className="text-center text-blue-500 py-10 border border-dashed border-blue-200 rounded-lg">
                  <p>No expenses to display</p>
                  <p className="text-xs mt-2">Add your first expense to see it here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}