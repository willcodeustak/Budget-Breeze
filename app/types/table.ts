export interface TableProps {
	transactions: {
		id: string;
		title: string;
		amount: number;
		date: string;
		budget_id: string;
	}[];
	budgets: {
		id: string;
		title: string;
		spent: number;
	}[];
	onUpdate: () => void;
	isLoading?: boolean;
	error?: string | null;
}
