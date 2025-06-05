import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Budget } from '../../../types/budget';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { toast } from 'react-hot-toast';
import { getBudgetColor } from '../../../utils/colors';

interface BudgetItemProps {
	budget: Budget;
	index: number;
	onUpdate: () => void;
}

export default function BudgetItem({
	budget,
	index,
	onUpdate,
}: BudgetItemProps) {
	const [title, setTitle] = useState(budget.title);
	const [amount, setAmount] = useState(budget.amount);
	const [isEditing, setIsEditing] = useState(false);
	const { confirmDelete } = useConfirmDelete();

	// Apply unique color based on index
	const { borderColor, bgColor } = getBudgetColor(index);

	const handleUpdate = async () => {
		const { error } = await supabase
			.from('budgets')
			.update({ title, amount })
			.eq('id', budget.id);

		if (error) {
			console.error('Error updating budget:', error);
		} else {
			setIsEditing(false);
			onUpdate();
			toast.success('Budget updated successfully');
		}
	};

	const handleDelete = () => {
		confirmDelete('Delete this budget?', async () => {
			const { error } = await supabase
				.from('budgets')
				.delete()
				.eq('id', budget.id);

			if (!error) {
				onUpdate();
			} else {
				toast.error('Failed to delete budget');
			}
		});
	};

	const percentSpent = (budget.spent || 0) / budget.amount;
	const isOverBudget = percentSpent > 1;

	return (
		<div
			// className={`p-2 sm:p-3 rounded-lg shadow-md border-l-4 ${borderColor} border-opacity-50 dark:text-white text-sm`}
			className={`p-3 sm:p-4 rounded-lg shadow-md border-l-4 sm:border-4 ${borderColor} border-opacity-50 dark:text-white`}
		>
			{isEditing ? (
				// Mobile-friendly edit form
				<div className="space-y-2 dark:text-black">
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="border p-2 w-full text-sm sm:text-base"
					/>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(Number(e.target.value))}
						className="border p-2 w-full text-sm sm:text-base"
					/>
					<div className="flex gap-2">
						<button
							onClick={handleUpdate}
							className="bg-green-500 text-white px-3 py-1 text-sm sm:text-base flex-1"
						>
							Save
						</button>
						<button
							onClick={() => setIsEditing(false)}
							className="bg-gray-500 text-white px-3 py-1 text-sm sm:text-base flex-1"
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<>
					{/* Mobile: Compact view */}
					<div className="sm:hidden">
						<div className="flex justify-between items-start gap-2">
							<h3 className="font-bold text-sm line-clamp-1">{budget.title}</h3>
							<span className="text-xs font-semibold whitespace-nowrap">
								${budget.amount.toFixed(2)}
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
							<div
								className={`h-2 rounded-full ${bgColor}`}
								style={{
									width: `${Math.min(
										100,
										((budget.spent || 0) / budget.amount) * 100
									)}%`,
								}}
							></div>
						</div>
						<div className="flex justify-between mt-1 text-xs">
							<span>${(budget.spent || 0).toFixed(2)}</span>
							<span
								className={isOverBudget ? 'text-red-500' : 'text-green-500'}
							>
								${(budget.amount - (budget.spent || 0)).toFixed(2)}
							</span>
						</div>
					</div>

					{/* Desktop: Full view */}
					<div className="hidden sm:block">
						<div className="flex justify-between items-start gap-2 mb-2">
							<h2 className="font-bold text-lg line-clamp-2">{budget.title}</h2>
							<span className="font-semibold whitespace-nowrap">
								${budget.amount.toFixed(2)}
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-3 mb-2">
							<div
								className={`h-3 rounded-full ${bgColor}`}
								style={{
									width: `${Math.min(
										100,
										((budget.spent || 0) / budget.amount) * 100
									)}%`,
								}}
							></div>
						</div>
						<div className="flex justify-between text-sm mb-3">
							<span>Spent: ${(budget.spent || 0).toFixed(2)}</span>
							<span
								className={isOverBudget ? 'text-red-500' : 'text-green-500'}
							>
								Remaining: ${(budget.amount - (budget.spent || 0)).toFixed(2)}
							</span>
						</div>
					</div>

					{/* Actions - same for both */}
					<div className="flex gap-2 justify-end pt-2 border-t border-gray-200 dark:border-gray-600">
						<button
							onClick={() => setIsEditing(true)}
							className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs sm:text-sm"
						>
							Edit
						</button>
						<button
							onClick={handleDelete}
							className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
						>
							Delete
						</button>
					</div>
				</>
			)}
		</div>
	);
}
