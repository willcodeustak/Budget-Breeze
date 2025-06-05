export const formatDate = (dateString: string) => {
	const date = new Date(dateString);

	const userTimezoneOffset = date.getTimezoneOffset() * 60000; //return the difference between the timezone mismatch
	const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
	return adjustedDate.toLocaleDateString();
};
