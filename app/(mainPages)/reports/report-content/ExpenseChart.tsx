'use client';

import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from 'recharts';
import type { Budget } from '../../../types/budget';
import { getBudgetColor } from '../../../utils/colors';

interface ExpenseChartProps {
	expenses: { name: string; value: number; budgetId?: string }[];
	budgets: Budget[];
	transactions: any[];
}

export default function ExpenseChart({
	expenses,
	budgets,
	transactions,
}: ExpenseChartProps) {
	const data = expenses;

	if (data.length === 0) {
		return (
			<p className="text-center text-gray-500">
				No data available for the selected period.
			</p>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={300}>
			<PieChart>
				<Pie
					data={data}
					cx="50%"
					cy="50%"
					label={({ value, payload }) => {
						//find the transaction that matches the value and budgetId
						const transaction = transactions.find(
							(t) => t.budget_id === payload.budgetId && t.amount === value
						);
						//date on pie
						return transaction
							? new Date(transaction.date).toLocaleDateString()
							: '';
					}}
					labelLine={false}
					outerRadius={80}
					fill="#8884d8"
					dataKey="value"
				>
					{data.map((entry, index) => {
						//find the budget associated with the expense

						const budget = budgets.find((b) =>
							entry.budgetId ? b.id === entry.budgetId : b.title === entry.name
						);
						const budgetIndex = budget ? budgets.indexOf(budget) : -1;
						const { bgColor } =
							budgetIndex !== -1
								? getBudgetColor(budgetIndex)
								: { bgColor: 'bg-gray-500' };
						//Recharts, the library used for creating the pie chart, expects actual color values (like hex codes or RGB values) for its `fill` property, not CSS class names.
						//Recharts cannot understand tailwind
						// Convert Tailwind class to CSS color
						const colorMap: { [key: string]: string } = {
							'bg-red-400': '#f87171',
							'bg-blue-400': '#60a5fa',
							'bg-green-400': '#4ade80',
							'bg-yellow-400': '#fbbf24',
							'bg-purple-400': '#a78bfa',
							'bg-pink-400': '#f472b6',
							'bg-indigo-400': '#818cf8',
							'bg-teal-400': '#2dd4bf',
							'bg-orange-400': '#fb923c',
							'bg-cyan-400': '#22d3ee',
							'bg-lime-400': '#a3e635',
							'bg-amber-400': '#fbbf24',
							'bg-violet-400': '#a78bfa',
							'bg-fuchsia-400': '#e879f9',
							'bg-rose-400': '#fb7185',
							'bg-sky-400': '#38bdf8',
							'bg-emerald-400': '#34d399',
							'bg-gray-400': '#9ca3af',
							'bg-gray-500': '#6b7280',
						};

						const chartColor = colorMap[bgColor] || '#6b7280';
						return <Cell key={`cell-${index}`} fill={chartColor} />;
					})}
				</Pie>
				<Tooltip />
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
}
