import TransactionsItem from './TransactionsItem';
import type { TableProps } from '@/app/types/table';
import { getBudgetColor } from '../../utils/colors';

export default function Table({ transactions, budgets, onUpdate }: TableProps) {
	return (
		<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
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
					{transactions.map((transaction) => {
						//find the budget by matching the budget_id of the transaction
						const budget = budgets.find((b) => b.id === transaction.budget_id);

						//if the budget exists, find its index in the budgets array to get the color
						const budgetIndex = budgets.findIndex(
							(b) => b.id === transaction.budget_id
						);
						const { bgColor } = budget
							? getBudgetColor(budgetIndex) //get the color based on the index of the budget
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
	);
}
