import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  CalendarIcon, 
  PiggyBankIcon, 
  TrendingUpIcon, 
  CreditCardIcon, 
  ArrowDownIcon, 
  ArrowUpIcon,
  HomeIcon, 
  ShoppingBagIcon, 
  CarIcon, 
  UtensilsIcon, 
  HeartIcon, 
  FilmIcon, 
  LightbulbIcon, 
  TagIcon
} from 'lucide-react';
import type { Expense, Salary } from '@/types';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');
  
  // Fetch expenses data
  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
    enabled: true,
  });
  
  // Fetch salaries data
  const { data: salaries = [] } = useQuery<Salary[]>({
    queryKey: ['/api/salaries'],
    enabled: true,
  });

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum: number, exp: Expense) => sum + Number(exp.amount), 0);
  
  // Calculate total income
  const totalIncome = salaries.reduce((sum: number, salary: Salary) => sum + Number(salary.amount), 0);
  
  // Calculate balance
  const balance = totalIncome - totalExpenses;
  
  // Group expenses by category for pie chart
  const expensesByCategory = expenses.reduce((acc: Record<string, number>, exp: Expense) => {
    const category = exp.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Number(exp.amount);
    return acc;
  }, {});
  
  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Prepare data for bar chart - by month
  const today = new Date();
  const currentMonth = today.getMonth();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - i + 12) % 12;
    return monthNames[monthIndex];
  }).reverse();
  
  const barChartData = last6Months.map(month => {
    const monthIndex = monthNames.indexOf(month);
    
    const monthExpenses = expenses.filter((exp: Expense) => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === monthIndex;
    }).reduce((sum: number, exp: Expense) => sum + Number(exp.amount), 0);
    
    const monthIncome = salaries.filter((salary: Salary) => {
      const fullMonthName = ['January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December'][monthIndex];
      return salary.month === fullMonthName;
    }).reduce((sum: number, salary: Salary) => sum + Number(salary.amount), 0);
    
    return {
      name: month,
      expenses: monthExpenses,
      income: monthIncome,
    };
  });
  
  // Colors for the pie chart - diverse colors including yellow, orange, green, and black
  const COLORS = ['#2B2D42', '#FFB703', '#FB8500', '#057A40', '#D62828', '#86A013', '#023047', '#023B26', '#F77F00'];
  
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
  
  // Function to get appropriate icon for category (larger version for activity list)
  const getLargeActivityIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('rent') || lowerCategory.includes('home') || lowerCategory.includes('house')) {
      return <HomeIcon className="h-5 w-5 text-white" />;
    }
    if (lowerCategory.includes('food') || lowerCategory.includes('grocery') || lowerCategory.includes('groceries')) {
      return <ShoppingBagIcon className="h-5 w-5 text-white" />;
    }
    if (lowerCategory.includes('transport') || lowerCategory.includes('car') || lowerCategory.includes('fuel')) {
      return <CarIcon className="h-5 w-5 text-white" />;
    }
    if (lowerCategory.includes('restaurant') || lowerCategory.includes('dining')) {
      return <UtensilsIcon className="h-5 w-5 text-white" />;
    }
    if (lowerCategory.includes('health') || lowerCategory.includes('medical')) {
      return <HeartIcon className="h-5 w-5 text-white" />;
    }
    if (lowerCategory.includes('entertainment') || lowerCategory.includes('movie') || lowerCategory.includes('film')) {
      return <FilmIcon className="h-5 w-5 text-white" />;
    }
    if (lowerCategory.includes('utility') || lowerCategory.includes('utilities') || lowerCategory.includes('electric')) {
      return <LightbulbIcon className="h-5 w-5 text-white" />;
    }
    
    // Default icon for other categories
    return <TagIcon className="h-5 w-5 text-white" />;
  };
  
  return (
    <Layout>
      <div className="max-w-6xl ml-0 pl-4">
        <h1 className="text-xl font-semibold mb-6">Financial Dashboard (PLN)</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-t-4 border-t-green-700">
            <CardHeader className="pb-2 bg-green-800">
              <CardTitle className="text-sm font-medium text-white">Total Income (PLN)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-700 mr-3">
                  <PiggyBankIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-green-900">{formatCurrency(totalIncome)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-amber-600">
            <CardHeader className="pb-2 bg-amber-700">
              <CardTitle className="text-sm font-medium text-white">Total Expenses (PLN)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-amber-600 mr-3">
                  <CreditCardIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-amber-900">{formatCurrency(totalExpenses)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`border-t-4 ${balance >= 0 ? 'border-t-green-700' : 'border-t-orange-700'}`}>
            <CardHeader className={`pb-2 ${balance >= 0 ? 'bg-green-800' : 'bg-orange-800'}`}>
              <CardTitle className={`text-sm font-medium text-white`}>Balance (PLN)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${balance >= 0 ? 'bg-green-700' : 'bg-orange-700'}`}>
                  {balance >= 0 ? (
                    <ArrowUpIcon className="h-5 w-5 text-white" />
                  ) : (
                    <ArrowDownIcon className="h-5 w-5 text-white" />
                  )}
                </div>
                <span className={`text-2xl font-bold ${balance >= 0 ? 'text-green-900' : 'text-orange-900'}`}>
                  {formatCurrency(Math.abs(balance))}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Category Totals Card */}
        <Card className="mb-6 border-l-4 border-l-amber-600">
          <CardHeader className="bg-amber-700">
            <CardTitle className="text-white">Category Totals (PLN)</CardTitle>
            <CardDescription className="text-amber-100">Total spent in each expense category (PLN)</CardDescription>
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
                    <span className="text-lg font-semibold text-amber-800">{formatCurrency(amount)}</span>
                  </div>

                  {/* Progress bar for % of total income */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-amber-700">% of income</span>
                      <span className="font-medium px-2 py-0.5 rounded-full" 
                        style={{ 
                          backgroundColor: totalIncome > 0 && (amount / totalIncome > 0.2) ? '#FEF2F2' : '#FEF3C7',
                          color: totalIncome > 0 && (amount / totalIncome > 0.2) ? '#B91C1C' : '#92400E'
                        }}>
                        {totalIncome > 0 ? `${(amount / totalIncome * 100).toFixed(1)}%` : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{
                          width: `${Math.round(amount / totalIncome * 100)}%`,
                          backgroundColor: totalIncome > 0 && (amount / totalIncome > 0.2) ? '#DC2626' : '#D97706'
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
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="border-t-4 border-t-blue-600">
            <CardHeader className="bg-blue-700">
              <CardTitle className="text-white">Income vs Expenses (PLN)</CardTitle>
              <CardDescription className="text-blue-100">Comparison over the last 6 months (PLN)</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EFF6FF" />
                    <XAxis dataKey="name" stroke="#1E40AF" />
                    <YAxis stroke="#1E40AF" />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))} 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #DBEAFE' }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#057A40" name="Income" />
                    <Bar dataKey="expenses" fill="#FB8500" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-black">
            <CardHeader className="bg-gray-800">
              <CardTitle className="text-white">Expense Breakdown (PLN)</CardTitle>
              <CardDescription className="text-gray-300">By category (PLN)</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))} 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity Section */}
        <Card className="border-t-4 border-t-yellow-600">
          <CardHeader className="bg-yellow-700">
            <CardTitle className="text-white">Recent Activity (PLN)</CardTitle>
            <CardDescription className="text-yellow-100">Your latest financial transactions (PLN)</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {expenses.slice(0, 5).map((expense: Expense, index) => (
                <div key={expense.id} className="flex items-start border-b border-yellow-100 pb-3 hover:bg-yellow-50 p-2 rounded">
                  <div 
                    className="flex items-center justify-center h-12 w-12 rounded-full mr-3 shadow-md"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {getLargeActivityIcon(expense.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{expense.category}</p>
                        <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <p className="font-medium text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                        -{formatCurrency(Number(expense.amount))}
                      </p>
                    </div>
                    {expense.description && (
                      <p className="text-sm mt-1 text-gray-600">{expense.description}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {expenses.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <p>No recent transactions found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}