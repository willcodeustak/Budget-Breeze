import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Budget } from '../../../types/budget';
import { Toaster, toast } from 'react-hot-toast';

interface TransactionsFormProps {
	budgets: Budget[]; // drop down

	onTransactionsAdded: (updatedBudgets: Budget[]) => void; //refresh budgets after adding a transaction
}

export default function TransactionsForm({
	budgets,
	onTransactionsAdded,
}: TransactionsFormProps) {
	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState('');
	const [selectedBudgetId, setSelectedBudgetId] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (budgets.length > 0) {
			// console.log('Budgets:', budgets);
			setSelectedBudgetId(budgets[0].id); // default to first budget
		}
	}, [budgets]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			// console.log('Selected Budget ID (onSubmit):', selectedBudgetId);

			if (!selectedBudgetId) {
				console.error('No budget selected');
				alert('Please select a budget to add Transactions.');
				return;
			}

			if (Number(amount) <= 0) {
				throw new Error('Amount must be greater than 0.');
			}

			//search for budget within supa table
			const selectedBudget = budgets.find(
				(budget) => budget.id === selectedBudgetId
			);

			if (!selectedBudget) {
				// console.error('Selected budget not found');
				// console.log('Selected Budget ID:', selectedBudgetId);
				// console.log('Budgets:', budgets);
				alert('Selected budget not found. Please try again.');
				return;
			}
			const newSpent = (selectedBudget.spent || 0) + Number(amount);

			// First insert the transaction
			const { error: transactionsError } = await supabase
				.from('transactions')
				.insert([
					{
						title,
						amount: Number(amount),
						budget_id: selectedBudgetId,
						user_id: user?.id,
						date: new Date().toISOString(),
					},
				]);

			if (transactionsError) {
				throw new Error('Error adding transaction. Please try again.');
			}

			// Then update the budget
			const { error: budgetError } = await supabase
				.from('budgets')
				.update({ spent: newSpent })
				.eq('id', selectedBudgetId);

			if (budgetError) {
				// If budget update fails, we should roll back the transaction
				await supabase
					.from('transactions')
					.delete()
					.eq('title', title)
					.eq('amount', Number(amount))
					.eq('budget_id', selectedBudgetId)
					.eq('user_id', user?.id);

				throw new Error(
					'Error updating budget. Transaction has been rolled back.'
				);
			}

			// Update client-side state
			const updatedBudgets = budgets.map((budget) =>
				budget.id === selectedBudgetId ? { ...budget, spent: newSpent } : budget
			);
			toast.success('Transaction created 🎉', {
				className: 'text-xl p-4 min-w-[300px]',
			});
			onTransactionsAdded(updatedBudgets);

			// Reset form
			setTitle('');
			setAmount('');
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'An unexpected error occurred'
			);
			toast.error(
				err instanceof Error ? err.message : 'An unexpected error occurred'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// If there are no budgets, tell user they need to create a budget first before able to add a Transactions
	if (budgets.length === 0) {
		return (
			<div className="p-4 bg-yellow-100 rounded-lg text-yellow-800 ">
				Please create a budget first to add transactions.
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<div className="p-4 bg-red-100 rounded-lg text-red-800">{error}</div>
			)}
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Transaction Title"
				className="border p-2 w-full rounded-lg"
				required
				disabled={isSubmitting}
			/>
			<input
				type="number"
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				placeholder="Amount"
				className="border p-2 w-full rounded-lg"
				required
				min="0.01"
				step="0.01"
				disabled={isSubmitting}
			/>
			<select
				value={selectedBudgetId}
				onChange={(e) => {
					setSelectedBudgetId(e.target.value);
				}}
				className="border p-2 w-full"
				required
				disabled={isSubmitting}
			>
				{budgets.map((budget) => (
					<option key={budget.id} value={budget.id}>
						{budget.title}
					</option>
				))}
			</select>
			<button
				type="submit"
				className={`px-4 py-2 text-white transition-colors ${
					isSubmitting
						? 'bg-blue-400 cursor-not-allowed'
						: 'bg-blue-500 hover:bg-blue-600'
				}`}
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Adding...' : 'Add Transaction'}
			</button>
		</form>
	);
}
