export interface TransactionsItemProps {
	transactions: {
		id: string;
		title: string;
		amount: number;
		date: string;
		budget_id: string;
		// budgetColor: string;
	};
	budgets: {
		id: string;
		title: string;
		spent: number;
	}[];
	onUpdate: () => void;
	budgetColor: string;
}
