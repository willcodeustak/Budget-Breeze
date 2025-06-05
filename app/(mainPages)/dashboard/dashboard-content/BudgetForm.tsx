import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Budget } from '../../../types/budget';
import { Toaster, toast } from 'react-hot-toast';

interface BudgetFormProps {
	onBudgetAdded: (newBudget: Budget) => void;
}

export default function BudgetForm({ onBudgetAdded }: BudgetFormProps) {
	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		setIsSubmitting(true);

		const { data, error } = await supabase
			.from('budgets')
			.insert([
				{
					title,
					amount,
					user_id: user?.id,
				},
			])
			.select()
			.single();

		if (error) {
			console.error('Error adding budget:', error);
		} else if (data) {
			onBudgetAdded(data);
			toast.success('Budget Created 🎉', {
				className: 'text-xl p-4 min-w-[300px]',
			});
			setTitle('');
			setAmount('');
		}

		setIsSubmitting(false);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Budget Name"
				className="border p-2 w-full "
			/>
			<input
				type="number"
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				placeholder="Amount"
				className="border p-2 w-full"
			/>
			<button
				type="submit"
				className={`px-4 py-2 text-white transition-colors ${
					isSubmitting
						? 'bg-blue-400 cursor-not-allowed'
						: 'bg-blue-500 hover:bg-blue-600'
				}`}
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Creating...' : 'Create Budget'}
			</button>
		</form>
	);
}
