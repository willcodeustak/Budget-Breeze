'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { TransactionsItemProps } from '@/app/types/transactions';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { toast } from 'react-hot-toast';

export default function TransactionsItem({
	transactions,
	budgets,
	onUpdate,
	budgetColor,
}: TransactionsItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState(transactions.title);
	const [newAmount, setNewAmount] = useState(transactions.amount);
	const [newDate, setNewDate] = useState(transactions.date.split('T')[0]);
	const [newBudgetId, setNewBudgetId] = useState(transactions.budget_id);
	const [isMobile, setIsMobile] = useState(false);
	const { confirmDelete } = useConfirmDelete();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const handleUpdate = async () => {
		const amountDifference = newAmount - transactions.amount;

		//update transaction
		const { error: transactionsError } = await supabase
			.from('transactions')
			.update({
				title: newTitle,
				amount: newAmount,
				date: newDate,
				budget_id: newBudgetId,
			})
			.eq('id', transactions.id);

		if (transactionsError) {
			console.error('Error updating transactions:', transactionsError);
			toast.error('Failed to update transaction');
			return;
		}

		//update old budget if budget changed
		if (transactions.budget_id !== newBudgetId) {
			const oldBudget = budgets.find((b) => b.id === transactions.budget_id);
			if (oldBudget) {
				const newSpent = oldBudget.spent - transactions.amount;
				await supabase
					.from('budgets')
					.update({ spent: newSpent })
					.eq('id', oldBudget.id);
			}
		}

		//update new budget
		const selectedBudget = budgets.find((b) => b.id === newBudgetId);
		if (selectedBudget) {
			const newSpent =
				selectedBudget.spent +
				(transactions.budget_id === newBudgetId ? amountDifference : newAmount);

			await supabase
				.from('budgets')
				.update({ spent: newSpent })
				.eq('id', selectedBudget.id);
		}

		onUpdate();
		setIsEditing(false);
		toast.success('Transaction updated successfully');
	};

	const handleDelete = async () => {
		confirmDelete(
			'Are you sure you want to delete this transaction?',
			async () => {
				const selectedBudget = budgets.find(
					(b) => b.id === transactions.budget_id
				);
				if (selectedBudget) {
					const newSpent = selectedBudget.spent - transactions.amount;

					const { error: budgetError } = await supabase
						.from('budgets')
						.update({ spent: newSpent })
						.eq('id', selectedBudget.id);

					if (budgetError) {
						console.error('Error updating budget:', budgetError);
						toast.error('Failed to update budget');
						return;
					}
				}

				const { error } = await supabase
					.from('transactions')
					.delete()
					.eq('id', transactions.id);

				if (error) {
					console.error('Error deleting transactions:', error);
					toast.error('Failed to delete transaction');
					return;
				}

				onUpdate();
			}
		);
	};

	// Mobile view
	if (isMobile) {
		return (
			<div className="w-full">
				{isEditing ? (
					<div className="flex flex-col gap-2 mb-2">
						<input
							type="text"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							className="border rounded px-2 py-1 w-full text-xs bg-gray-100 dark:bg-gray-600 dark:text-white"
							placeholder="Title"
						/>
						<input
							type="number"
							value={newAmount}
							onChange={(e) => setNewAmount(Number(e.target.value))}
							className="border rounded px-2 py-1 w-full text-xs bg-gray-100 dark:bg-gray-600 dark:text-white"
							placeholder="Amount"
						/>
						<input
							type="date"
							value={newDate}
							onChange={(e) => setNewDate(e.target.value)}
							className="border rounded px-2 py-1 w-full text-xs bg-gray-100 dark:bg-gray-600 dark:text-white"
						/>
						<select
							value={newBudgetId}
							onChange={(e) => setNewBudgetId(e.target.value)}
							className="border rounded px-2 py-1 w-full text-xs bg-gray-100 dark:bg-gray-600 dark:text-white"
						>
							{budgets.map((budget) => (
								<option key={budget.id} value={budget.id}>
									{budget.title}
								</option>
							))}
						</select>
						<div className="flex justify-end gap-2">
							<button
								onClick={handleUpdate}
								className="text-[10px] text-green-600 hover:text-green-900"
							>
								Save
							</button>
							<button
								onClick={() => setIsEditing(false)}
								className="text-[10px] text-gray-600 hover:text-gray-900"
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<div className="flex justify-end items-center gap-3">
						<button
							onClick={() => setIsEditing(true)}
							className="text-[10px] text-blue-600 hover:text-blue-900"
						>
							Edit
						</button>
						<button
							onClick={handleDelete}
							className="text-[10px] text-red-600 hover:text-red-900"
						>
							Delete
						</button>
					</div>
				)}
			</div>
		);
	}

	// Desktop view
	return (
		<tr>
			<td className="px-4 py-3 whitespace-normal break-words max-w-[150px] sm:max-w-none">
				{isEditing ? (
					<input
						type="text"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						className="border rounded px-2 py-1 w-full text-sm sm:text-base bg-gray-300 dark:text-black"
					/>
				) : (
					transactions.title
				)}
			</td>
			<td className="px-4 py-3 whitespace-nowrap">
				{isEditing ? (
					<input
						type="number"
						value={newAmount}
						onChange={(e) => setNewAmount(Number(e.target.value))}
						className="border rounded px-2 py-1 w-full text-sm sm:text-base bg-gray-300 dark:text-black"
					/>
				) : (
					`$${transactions.amount.toFixed(2)}`
				)}
			</td>
			<td className="px-4 py-3 whitespace-nowrap">
				{isEditing ? (
					<input
						type="date"
						value={newDate}
						onChange={(e) => setNewDate(e.target.value)}
						className="border rounded px-2 py-1 w-full text-sm sm:text-base bg-gray-300 dark:text-black"
					/>
				) : (
					new Date(transactions.date).toLocaleDateString()
				)}
			</td>
			<td className="px-4 py-3 whitespace-normal">
				{isEditing ? (
					<select
						value={newBudgetId}
						onChange={(e) => setNewBudgetId(e.target.value)}
						className="border rounded px-2 py-1 w-full text-sm sm:text-base bg-gray-300 dark:text-black"
					>
						{budgets.map((budget) => (
							<option key={budget.id} value={budget.id}>
								{budget.title}
							</option>
						))}
					</select>
				) : budgets.find((b) => b.id === transactions.budget_id) ? (
					<span
						className={`px-2 py-1 rounded text-xs sm:text-sm ${budgetColor} text-white`}
					>
						{budgets.find((b) => b.id === transactions.budget_id)?.title}
					</span>
				) : (
					<span className="text-xs sm:text-sm">Budget deleted</span>
				)}
			</td>
			<td className="px-4 py-3 whitespace-nowrap">
				<div className="flex justify-start gap-2 text-sm">
					{isEditing ? (
						<>
							<button
								onClick={handleUpdate}
								className="text-green-600 hover:text-green-900"
							>
								Save
							</button>
							<button
								onClick={() => setIsEditing(false)}
								className="text-gray-600 hover:text-gray-900"
							>
								Cancel
							</button>
						</>
					) : (
						<>
							<button
								onClick={() => setIsEditing(true)}
								className="text-blue-600 hover:text-blue-900"
							>
								Edit
							</button>
							<button
								onClick={handleDelete}
								className="text-red-600 hover:text-red-900"
							>
								Delete
							</button>
						</>
					)}
				</div>
			</td>
		</tr>
	);
}
