'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ExpenseChart from '../../components/dashboard-content/report-content/ExpenseChart';
import { Toaster } from 'react-hot-toast';
import type { Budget } from '../../types/budget';

export default function Reports() {
	const [transactions, setTransactions] = useState<any[]>([]);
	const [budgets, setBudgets] = useState<Budget[]>([]);

	const getNYDate = () => {
		const date = new Date();
		const nyDate = new Date(
			date.toLocaleString('en-US', { timeZone: 'America/New_York' })
		);
		nyDate.setHours(12, 0, 0, 0);
		return nyDate;
	};

	const [selectedDate, setSelectedDate] = useState<Date>(getNYDate());
	const [dateInputValue, setDateInputValue] = useState(
		getNYDate().toISOString().split('T')[0]
	);

	const handleDateChange = (value: string) => {
		// 4 digits validation for year
		const yearPart = value.split('-')[0];
		if (yearPart && yearPart.length > 4) return;

		setDateInputValue(value);
		const date = new Date(value);
		if (!isNaN(date.getTime())) {
			date.setHours(12, 0, 0, 0);
			setSelectedDate(date);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const { data: transactionsData } = await supabase
				.from('transactions')
				.select('*');

			const { data: budgetsData } = await supabase
				.from('budgets')
				.select('*')
				.order('created_at', { ascending: true });

			setTransactions(transactionsData || []);
			setBudgets(budgetsData || []);
		};
		fetchData();
	}, []);

	const filterTransactionsByPeriod = (period: 'day' | 'week' | 'month') => {
		const date = new Date(selectedDate);

		return transactions.filter((transaction) => {
			const transDate = new Date(transaction.date);

			switch (period) {
				case 'day': {
					const startOfDay = new Date(date);
					startOfDay.setHours(0, 0, 0, 0);
					const endOfDay = new Date(date);
					endOfDay.setHours(23, 59, 59, 999);
					return transDate >= startOfDay && transDate <= endOfDay;
				}
				case 'week': {
					const dayOfWeek = date.getDay();
					const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
					const weekStart = new Date(date);
					weekStart.setDate(date.getDate() - diffToMonday);
					weekStart.setHours(0, 0, 0, 0);

					const weekEnd = new Date(weekStart);
					weekEnd.setDate(weekStart.getDate() + 6);
					weekEnd.setHours(23, 59, 59, 999);

					return transDate >= weekStart && transDate <= weekEnd;
				}
				case 'month': {
					const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
					const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
					monthEnd.setHours(23, 59, 59, 999);
					return transDate >= monthStart && transDate <= monthEnd;
				}
				default:
					return true;
			}
		});
	};
	const processChartData = (transactions: any[]) => {
		return transactions.reduce((acc, transaction) => {
			const budget = budgets.find((b) => b.id === transaction.budget_id);
			const budgetId = budget?.id;
			const budgetName = budget?.title || 'Uncategorized';

			const existing = acc.find((item: any) =>
				budgetId ? item.budgetId === budgetId : item.name === budgetName
			);

			if (existing) {
				existing.value += transaction.amount;
			} else {
				acc.push({
					name: budgetName,
					value: transaction.amount,
					budgetId: budgetId,
				});
			}
			return acc;
		}, [] as { name: string; value: number; budgetId?: string }[]);
	};
	const calculateTotal = (transactions: any[]) => {
		return transactions.reduce(
			(sum, transaction) => sum + transaction.amount,
			0
		);
	};

	const getDailyDateString = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};
	// const getWeekRangeString = (date: Date) => {
	// 	const start = new Date(date);
	// 	start.setDate(date.getDate() - date.getDay() + 1);
	// 	const end = new Date(start);
	// 	end.setDate(start.getDate() + 6);

	// 	return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
	// };

	// const getMonthString = (date: Date) => {
	// 	return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	// };

	const getWeeklyDateRange = (date: Date) => {
		const start = new Date(date); //new date object to avoid messing up the original
		const dayOfWeek = start.getDay(); //current day of the week (0 - Sunday, 1 - Monday)

		//force Monday. If it's sunday (day 0), set to previous monday (6 days ago), otherwise move back to monday
		const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
		start.setDate(start.getDate() + diffToMonday); // Set the date to the previous Monday

		const end = new Date(start); //object for the end of the week
		end.setDate(start.getDate() + 6); //6 days after the start (Sunday)

		const options: Intl.DateTimeFormatOptions = {
			month: 'short',
			day: 'numeric',
		};

		const yearString =
			start.getFullYear() !== end.getFullYear() ? `, ${end.getFullYear()}` : '';

		return `${start.toLocaleDateString(
			'en-US',
			options
		)} - ${end.toLocaleDateString('en-US', options)}${yearString}`;
	};

	const getMonthlyDateString = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric',
		});
	};

	const dailyTransactions = filterTransactionsByPeriod('day');
	const weeklyTransactions = filterTransactionsByPeriod('week');
	const monthlyTransactions = filterTransactionsByPeriod('month');

	return (
		<div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen dark:bg-gray-800">
			<Toaster position="top-center" />
			<h1 className="text-5xl font-extrabold text-gray-900 text-center mb-10 dark:text-white">
				Expenses Overview
			</h1>

			<div className="flex justify-end mb-8 dark:bg-gray-800 dark:text-white">
				<input
					type="date"
					value={dateInputValue}
					onChange={(e) => handleDateChange(e.target.value)}
					className="border p-2 rounded dark:bg-gray-800 dark:text-white"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
				<div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-700 dark:text-white">
					<h2 className="text-xl font-semibold mb-4 ">
						{' '}
						Daily Total ({getDailyDateString(selectedDate)})
					</h2>
					<p className="text-3xl font-bold">
						${calculateTotal(dailyTransactions).toFixed(2)}
					</p>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-700 dark:text-white">
					<h2 className="text-xl font-semibold mb-4 ">
						{' '}
						Weekly Total ({getWeeklyDateRange(selectedDate)})
					</h2>
					<p className="text-3xl font-bold">
						${calculateTotal(weeklyTransactions).toFixed(2)}
					</p>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-700 dark:text-white">
					<h2 className="text-xl font-semibold mb-4">
						{' '}
						Monthly Total ({getMonthlyDateString(selectedDate)})
					</h2>
					<p className="text-3xl font-bold">
						${calculateTotal(monthlyTransactions).toFixed(2)}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
				<div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-700 dark:text-white">
					<h2 className="text-xl font-semibold mb-4">Daily Breakdown</h2>
					<ExpenseChart
						expenses={processChartData(dailyTransactions)}
						budgets={budgets}
						transactions={dailyTransactions}
					/>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-700 dark:text-white">
					<h2 className="text-xl font-semibold mb-4">Weekly Breakdown</h2>
					<ExpenseChart
						expenses={processChartData(weeklyTransactions)}
						budgets={budgets}
						transactions={weeklyTransactions}
					/>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-700 dark:text-white">
					<h2 className="text-xl font-semibold mb-4">Monthly Breakdown</h2>
					<ExpenseChart
						expenses={processChartData(monthlyTransactions)}
						budgets={budgets}
						transactions={monthlyTransactions}
					/>
				</div>
			</div>
		</div>
	);
}
