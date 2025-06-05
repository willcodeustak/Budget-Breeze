import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { message } = await request.json();
		const apiRequestBody = { contents: [{ parts: [{ text: message }] }] };
		const API_KEY = process.env.NEXT_PUBLIC_API_GENERATIVE_LANGUAGE_CLIENT;

		// console.log('API Key:', API_KEY);

		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(apiRequestBody),
			}
		);

		const data = await response.json();
		const botMessage =
			data?.candidates?.[0]?.content?.parts?.[0]?.text ||
			'No response from bot, most likely server side issue. Please try again later.';

		return NextResponse.json({ message: botMessage });
	} catch (error) {
		console.error('Error in chat API:', error);
		return NextResponse.json(
			{ error: 'Failed to process your request' },
			{ status: 500 }
		);
	}
}
