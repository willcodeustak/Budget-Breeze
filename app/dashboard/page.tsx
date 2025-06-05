'use client';
import { useEffect, useState } from 'react';
import BudgetForm from './dashboard-content/BudgetForm';
import BudgetItem from './dashboard-content/BudgetItem';
import TransactionsForm from './dashboard-content/TransactionsForm';
import { supabase } from '@/lib/supabase';
import type { Budget } from '../types/budget';
import Table from './dashboard-content/Table';
import { Toaster } from 'react-hot-toast';

export default function DashboardPage() {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [transactions, setTransactions] = useState<any[]>([]);
	const [visibleBudgets, setVisibleBudgets] = useState<Budget[]>([]);
	const [page, setPage] = useState(0);
	const [isGridMode, setIsGridMode] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchBudgets = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const { data, error } = await supabase
			.from('budgets')
			.select('*')
			.eq('user_id', user?.id)
			.order('created_at', { ascending: true });

		if (error) {
			console.error('Error fetching budgets:', error);
		} else {
			setBudgets(data as Budget[]);
		}
	};

	const fetchTransactions = async () => {
		try {
			setError(null);
			setIsLoading(true);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			const { data, error } = await supabase
				.from('transactions')
				.select('*')
				.eq('user_id', user?.id)
				.order('date', { ascending: false });

			if (error) {
				throw new Error('Error fetching transactions. Please try again.');
			}

			setTransactions(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'An unexpected error occurred'
			);
			console.error('Error fetching transactions:', err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBudgets();
		fetchTransactions();
	}, []);

	useEffect(() => {
		if (isGridMode) {
			const start = page * 8;
			const end = start + 8;
			setVisibleBudgets(budgets.slice(start, end));
		}
	}, [budgets, page, isGridMode]);

	const onBudgetAdded = (newBudget: Budget) => {
		setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
	};

	const onTransactionsAdded = (updatedBudgets: Budget[]) => {
		setBudgets(updatedBudgets);
		fetchTransactions();
	};

	const handleTransactionsUpdate = () => {
		fetchBudgets();
		fetchTransactions();
	};

	const nextPage = () => {
		if ((page + 1) * 8 < budgets.length) {
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (page > 0) {
			setPage(page - 1);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Toaster position="top-center" />
			<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-6 md:mb-10 dark:text-white">
				Budget Overview
			</h1>

			{/* Forms Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
				<div className="bg-white p-4 sm:p-6 rounded-xl shadow-md dark:bg-gray-700">
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 dark:text-white">
						Create Budget
					</h2>
					<BudgetForm onBudgetAdded={onBudgetAdded} />
				</div>

				<div className="bg-white p-4 sm:p-6 rounded-xl shadow-md dark:bg-gray-700">
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 dark:text-white">
						Add Transaction
					</h2>
					<TransactionsForm
						budgets={budgets}
						onTransactionsAdded={onTransactionsAdded}
					/>
				</div>
			</div>

			{/* Budgets Section */}
			<div className="px-4 sm:px-6 max-w-7xl mx-auto w-full mb-10">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
					<h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white">
						Your Budgets
					</h2>
					<button
						onClick={() => setIsGridMode(!isGridMode)}
						className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm sm:text-base transition-colors hidden lg:inline-flex"
					>
						{isGridMode ? 'Cascade View' : 'Paginated View'}
					</button>
				</div>

				{/* Mobile: Always single column */}
				<div className="sm:hidden space-y-3">
					{budgets.map((budget, index) => (
						<BudgetItem
							key={budget.id}
							budget={budget}
							index={index}
							onUpdate={fetchBudgets}
						/>
					))}
				</div>

				{/* Desktop: Toggle between views */}
				<div className="hidden sm:block">
					{isGridMode ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{visibleBudgets.map((budget, index) => (
									<BudgetItem
										key={budget.id}
										budget={budget}
										index={index}
										onUpdate={fetchBudgets}
									/>
								))}
							</div>
							<div className="flex justify-between mt-6">
								<button
									onClick={prevPage}
									className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50 transition-colors"
									disabled={page === 0}
								>
									Previous
								</button>
								<span className="text-gray-600 dark:text-gray-300 self-center">
									Page {page + 1} of {Math.ceil(budgets.length / 8)}
								</span>
								<button
									onClick={nextPage}
									className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50 transition-colors"
									disabled={(page + 1) * 8 >= budgets.length}
								>
									Next
								</button>
							</div>
						</>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{budgets.map((budget, index) => (
								<BudgetItem
									key={budget.id}
									budget={budget}
									index={index}
									onUpdate={fetchBudgets}
								/>
							))}
						</div>
					)}
				</div>

				{budgets.length === 0 && (
					<div className="text-center py-8 text-gray-500 dark:text-gray-400">
						No budgets created yet. Start by creating your first budget above.
					</div>
				)}
			</div>

			{/* Transactions Section */}
			<div className="px-4 sm:px-6 max-w-7xl mx-auto w-full">
				<h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 dark:text-white">
					Transactions
				</h2>
				<Table
					transactions={transactions}
					budgets={budgets}
					onUpdate={handleTransactionsUpdate}
					isLoading={isLoading}
					error={error}
				/>
			</div>
		</div>
	);
}
