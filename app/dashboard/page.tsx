'use client';
import { useEffect, useState } from 'react';
import BudgetForm from '../components/dashboard-content/BudgetForm';
import BudgetItem from '../components/dashboard-content/BudgetItem';
import TransactionsForm from '../components/dashboard-content/TransactionsForm';
import { supabase } from '@/lib/supabase';
import type { Budget } from '../types/budget';
import Table from '../components/dashboard-content/Table';
import { Toaster } from 'react-hot-toast';

export default function DashboardPage({
	isSideNavOpen,
}: {
	isSideNavOpen: boolean;
}) {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [transactions, setTransactions] = useState<any[]>([]);
	const [visibleBudgets, setVisibleBudgets] = useState<Budget[]>([]);
	const [page, setPage] = useState(0);
	const [isCascading, setIsCascading] = useState(true);

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
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const { data, error } = await supabase
			.from('transactions')
			.select('*')
			.eq('user_id', user?.id)

			.order('date', { ascending: false });

		if (error) {
			console.error('Error fetching transactions:', error);
		} else {
			setTransactions(data);
		}
	};

	useEffect(() => {
		fetchBudgets();
		fetchTransactions();
	}, []);
	//might have to change to 3x3
	useEffect(() => {
		const start = page * 8;
		const end = start + 8;
		setVisibleBudgets(budgets.slice(start, end));
	}, [budgets, page]);

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
		<div
			className={`min-h-screen flex flex-col transition-all duration-300 ${
				isSideNavOpen ? 'pl-72' : 'pl-0'
			}`}
		>
			<Toaster position="top-center" />
			<h1 className="text-5xl font-extrabold text-gray-900 text-center mb-10 dark:text-white">
				Budget Overview
			</h1>

			{/* Budget and Transaction Forms */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
				<div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-700">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4 dark:text-white">
						Create Budget
					</h2>
					<BudgetForm onBudgetAdded={onBudgetAdded} />
				</div>

				<div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-700">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4 dark:text-white ">
						Add Transaction
					</h2>
					<TransactionsForm
						budgets={budgets}
						onTransactionsAdded={onTransactionsAdded}
					/>
				</div>
			</div>

			{/* Budgets Section */}
			<div className="space-y-8">
				<div>
					{/* Budget Title and Toggle Button */}
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
							Your Budgets
						</h2>
						<button
							onClick={() => setIsCascading(!isCascading)}
							className="px-4 py-2 bg-blue-500 text-white rounded-md"
						>
							Toggle {isCascading ? 'Grid Layout' : 'Cascade Layout'}
						</button>
					</div>

					<div className="w-full">
						<div
							className={`grid ${
								isCascading
									? 'grid-cols-4'
									: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
							} gap-6`}
						>
							{isCascading
								? budgets.map((budget, index) => (
										<div key={budget.id}>
											<BudgetItem
												budget={budget}
												index={index}
												onUpdate={fetchBudgets}
											/>
										</div>
								  ))
								: visibleBudgets.map((budget, index) => (
										<div key={budget.id}>
											<BudgetItem
												budget={budget}
												index={index}
												onUpdate={fetchBudgets}
											/>
										</div>
								  ))}
						</div>
					</div>

					{!isCascading && (
						<div className="flex justify-between mt-6">
							<button
								onClick={prevPage}
								className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
								disabled={page === 0}
							>
								Previous
							</button>
							<button
								onClick={nextPage}
								className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
								disabled={(page + 1) * 8 >= budgets.length}
							>
								Next
							</button>
						</div>
					)}
				</div>

				{/* Transactions Section */}
				<div>
					<h2 className="text-3xl font-semibold text-gray-800 mb-6 dark:text-white">
						Transactions
					</h2>
					<Table
						transactions={transactions}
						budgets={budgets}
						onUpdate={handleTransactionsUpdate}
					/>
				</div>
			</div>
		</div>
	);
}
