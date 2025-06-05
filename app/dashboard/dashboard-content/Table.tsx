import TransactionsItem from './TransactionsItem';
import type { TableProps } from '@/app/types/table';
import { getBudgetColor } from '../../utils/colors';
import { useState } from 'react';
import { formatDate } from '../../utils/date';

export default function Table({
	transactions,
	budgets,
	onUpdate,
	isLoading,
	error,
}: TableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(transactions.length / itemsPerPage);
	const totalTransactions = transactions.length;

	const paginatedTransactions = transactions.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Generate page numbers for pagination
	const getPageNumbers = () => {
		const pageNumbers = [];
		const maxVisiblePages = 5;
		const halfVisible = Math.floor(maxVisiblePages / 2);

		let startPage = Math.max(1, currentPage - halfVisible);
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}

		return pageNumbers;
	};

	if (isLoading) {
		return (
			<div className="w-full h-64 flex items-center justify-center">
				<div className="flex flex-col items-center space-y-4">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
					<p className="text-gray-500 dark:text-gray-400">
						Loading transactions...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
				<div className="flex items-center space-x-3">
					<svg
						className="h-6 w-6 text-red-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p className="text-red-700 dark:text-red-200">{error}</p>
				</div>
			</div>
		);
	}

	if (transactions.length === 0) {
		return (
			<div className="w-full p-8 text-center">
				<div className="flex flex-col items-center space-y-4">
					<svg
						className="h-12 w-12 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
					<p className="text-gray-500 dark:text-gray-400">
						No transactions found
					</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-4 flex justify-between items-center px-2">
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
					{Math.min(currentPage * itemsPerPage, totalTransactions)} of{' '}
					{totalTransactions} transactions
				</p>
			</div>

			{/* Mobile Grid View */}
			<div className="lg:hidden">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{paginatedTransactions.map((transaction) => {
						const budget = budgets.find((b) => b.id === transaction.budget_id);
						const budgetIndex = budgets.findIndex(
							(b) => b.id === transaction.budget_id
						);
						const { bgColor } = budget
							? getBudgetColor(budgetIndex)
							: { bgColor: 'bg-gray-500' };

						return (
							<div
								key={transaction.id}
								className="bg-white dark:bg-gray-700 rounded-lg shadow p-3 flex flex-col"
							>
								<div className="flex justify-between items-start mb-2">
									<span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[60%]">
										{transaction.title}
									</span>
									<span className="text-sm font-bold text-gray-900 dark:text-white">
										${transaction.amount.toFixed(2)}
									</span>
								</div>

								<div className="flex items-center gap-2 mb-2">
									<span
										className={`text-xs px-2 py-1 rounded text-white ${bgColor} truncate max-w-[120px]`}
									>
										{budget?.title || 'Budget deleted'}
									</span>
									<span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
										{formatDate(transaction.date)}
									</span>
								</div>

								<div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-600">
									<div className="flex justify-end gap-4">
										<button
											onClick={() => {
												const item = document.querySelector(
													`#transaction-${transaction.id}`
												) as HTMLElement;
												if (item) item.click();
											}}
											className="text-xs text-blue-600 hover:text-blue-800"
										>
											Edit
										</button>
										<button
											onClick={() => {
												const item = document.querySelector(
													`#delete-${transaction.id}`
												) as HTMLElement;
												if (item) item.click();
											}}
											className="text-xs text-red-600 hover:text-red-800"
										>
											Delete
										</button>
									</div>
								</div>

								<div className="hidden">
									<TransactionsItem
										transactions={transaction}
										budgets={budgets}
										onUpdate={onUpdate}
										budgetColor={bgColor}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Desktop Table View */}
			<div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
				<table className="min-w-full bg-white dark:bg-gray-700">
					<thead className="bg-gray-100 dark:bg-gray-600">
						<tr>
							<th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-700 dark:text-white">
								Name
							</th>
							<th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-700 dark:text-white">
								Amount
							</th>
							<th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-700 dark:text-white whitespace-nowrap">
								Date
							</th>
							<th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-700 dark:text-white">
								Budget
							</th>
							<th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-700 dark:text-white">
								Actions
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-200 dark:divide-gray-600 dark:text-white">
						{paginatedTransactions.map((transaction) => {
							const budget = budgets.find(
								(b) => b.id === transaction.budget_id
							);
							const budgetIndex = budgets.findIndex(
								(b) => b.id === transaction.budget_id
							);
							const { bgColor } = budget
								? getBudgetColor(budgetIndex)
								: { bgColor: 'bg-gray-500' };

							return (
								<TransactionsItem
									key={transaction.id}
									transactions={transaction}
									budgets={budgets}
									onUpdate={onUpdate}
									budgetColor={bgColor}
								/>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center mt-4 space-x-2">
					<button
						onClick={() => setCurrentPage(1)}
						disabled={currentPage === 1}
						className="hidden lg:inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-500"
					>
						First
					</button>
					<button
						onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
						disabled={currentPage === 1}
						className="hidden lg:inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-500"
					>
						Previous
					</button>

					<div className="flex space-x-1">
						{getPageNumbers().map((pageNum) => (
							<button
								key={pageNum}
								onClick={() => setCurrentPage(pageNum)}
								className={`px-3 py-1 text-sm rounded-md ${
									currentPage === pageNum
										? 'bg-blue-500 text-white'
										: 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500'
								}`}
							>
								{pageNum}
							</button>
						))}
					</div>

					<button
						onClick={() =>
							setCurrentPage((prev) => Math.min(totalPages, prev + 1))
						}
						disabled={currentPage === totalPages}
						className="hidden lg:inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-500"
					>
						Next
					</button>
					<button
						onClick={() => setCurrentPage(totalPages)}
						disabled={currentPage === totalPages}
						className="hidden lg:inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-500"
					>
						Last
					</button>
				</div>
			)}
		</div>
	);
}
