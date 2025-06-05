export interface Budget {
	findIndex(arg0: (b: any) => boolean): unknown;
	colorIndex: number;
	id: string;
	title: string;
	amount: number;
	spent: number;

	// userId: string;
}
