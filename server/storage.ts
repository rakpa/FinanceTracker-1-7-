import { expenses, indianExpenses, salaries, 
  type Expense as SchemaExpense, type InsertExpense, 
  type IndianExpense as SchemaIndianExpense, type InsertIndianExpense,
  type Salary as SchemaSalary, type InsertSalary } from "@shared/schema";

// Define interfaces that match the client side types
// Use the schema types directly without modifying them
type Expense = SchemaExpense;
type IndianExpense = SchemaIndianExpense;
type Salary = SchemaSalary;

export interface IStorage {
  // Expense methods
  getExpenses(): Promise<Expense[]>;
  getExpense(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  deleteExpense(id: number): Promise<boolean>;
  
  // Indian Expense methods
  getIndianExpenses(): Promise<IndianExpense[]>;
  getIndianExpense(id: number): Promise<IndianExpense | undefined>;
  createIndianExpense(expense: InsertIndianExpense): Promise<IndianExpense>;
  deleteIndianExpense(id: number): Promise<boolean>;
  
  // Salary methods
  getSalaries(): Promise<Salary[]>;
  getSalary(id: number): Promise<Salary | undefined>;
  createSalary(salary: InsertSalary): Promise<Salary>;
  updateSalary(id: number, salary: Partial<InsertSalary>): Promise<Salary | undefined>;
  deleteSalary(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private expenses: Map<number, Expense>;
  private indianExpenses: Map<number, IndianExpense>;
  private salaries: Map<number, Salary>;
  private expenseId: number;
  private indianExpenseId: number;
  private salaryId: number;

  constructor() {
    this.expenses = new Map();
    this.indianExpenses = new Map();
    this.salaries = new Map();
    this.expenseId = 1;
    this.indianExpenseId = 1;
    this.salaryId = 1;
  }

  // Expense methods
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.expenseId++;
    const now = new Date();
    
    // Parse amount to a number if it's a string
    const amount = typeof insertExpense.amount === 'string'
      ? parseFloat(insertExpense.amount)
      : insertExpense.amount;
      
    const expense: Expense = { 
      id,
      category: insertExpense.category,
      description: insertExpense.description || null,
      amount: amount,
      date: insertExpense.date instanceof Date 
        ? insertExpense.date 
        : (insertExpense.date ? new Date(insertExpense.date) : new Date()),
      createdAt: now
    };
    
    this.expenses.set(id, expense);
    return expense;
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }
  
  // Indian Expense methods
  async getIndianExpenses(): Promise<IndianExpense[]> {
    return Array.from(this.indianExpenses.values());
  }

  async getIndianExpense(id: number): Promise<IndianExpense | undefined> {
    return this.indianExpenses.get(id);
  }

  async createIndianExpense(insertIndianExpense: InsertIndianExpense): Promise<IndianExpense> {
    const id = this.indianExpenseId++;
    const now = new Date();
    
    // Parse amount to a number if it's a string
    const amount = typeof insertIndianExpense.amount === 'string'
      ? parseFloat(insertIndianExpense.amount)
      : insertIndianExpense.amount;
      
    const indianExpense: IndianExpense = { 
      id,
      category: insertIndianExpense.category,
      description: insertIndianExpense.description || null,
      amount: amount,
      date: insertIndianExpense.date instanceof Date 
        ? insertIndianExpense.date 
        : (insertIndianExpense.date ? new Date(insertIndianExpense.date) : new Date()),
      createdAt: now
    };
    
    this.indianExpenses.set(id, indianExpense);
    return indianExpense;
  }

  async deleteIndianExpense(id: number): Promise<boolean> {
    return this.indianExpenses.delete(id);
  }
  
  // Salary methods
  async getSalaries(): Promise<Salary[]> {
    return Array.from(this.salaries.values());
  }

  async getSalary(id: number): Promise<Salary | undefined> {
    return this.salaries.get(id);
  }

  async createSalary(insertSalary: InsertSalary): Promise<Salary> {
    const id = this.salaryId++;
    const now = new Date();
    
    // Parse all numeric values from strings if needed
    const amount = typeof insertSalary.amount === 'string' 
      ? parseFloat(insertSalary.amount) 
      : insertSalary.amount;
    
    // Ensure notes is a string or null
    const notes = insertSalary.notes === undefined ? null : insertSalary.notes;
        
    const salary: Salary = { 
      id,
      amount: amount,
      month: insertSalary.month,
      year: insertSalary.year,
      notes: notes,
      date: insertSalary.date instanceof Date 
        ? insertSalary.date 
        : (insertSalary.date ? new Date(insertSalary.date) : new Date()),
      createdAt: now
    };
    
    this.salaries.set(id, salary);
    return salary;
  }

  async updateSalary(id: number, updateData: Partial<InsertSalary>): Promise<Salary | undefined> {
    const existingSalary = this.salaries.get(id);
    if (!existingSalary) {
      return undefined;
    }

    // Parse amount if needed
    let amount: number;
    if (updateData.amount !== undefined) {
      amount = typeof updateData.amount === 'string' 
        ? parseFloat(updateData.amount)
        : updateData.amount;
    } else {
      amount = typeof existingSalary.amount === 'string'
        ? parseFloat(existingSalary.amount)
        : existingSalary.amount;
    }

    // Update each field if provided
    const updatedSalary: Salary = {
      ...existingSalary,
      amount: amount,
      month: updateData.month || existingSalary.month,
      year: updateData.year || existingSalary.year,
      notes: updateData.notes !== undefined ? updateData.notes : existingSalary.notes,
    };

    this.salaries.set(id, updatedSalary);
    return updatedSalary;
  }

  async deleteSalary(id: number): Promise<boolean> {
    return this.salaries.delete(id);
  }
}

// Import the DatabaseStorage implementation
import { DatabaseStorage } from './database-storage';

// Use the database storage implementation
export const storage = new DatabaseStorage();
