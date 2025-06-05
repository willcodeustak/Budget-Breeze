import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BiSend } from 'react-icons/bi';
import robotic from '../../images/robotic.png';
import Image from 'next/image';

type Message = {
	text: string;
	sender: 'user' | 'bot';
	time: string;
	read: boolean;
};

const getFormattedTime = () =>
	new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const DropdownMessage = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [showPredefinedQuestions, setShowPredefinedQuestions] = useState(true);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const predefinedQuestions = [
		'What is the 50/30/20 budgeting rule?',
		'How do credit scores affect my finances?',
		'What are some tips to save money? (Concise)',
		'What are some common budgeting mistakes to avoid? (Concise)',
	];

	const handlePredefinedQuestionClick = (question: string) => {
		setShowPredefinedQuestions(false);
		const time = getFormattedTime();
		const newUserMessage: Message = {
			text: question,
			sender: 'user',
			time,
			read: true,
		};
		setMessages((prev) => [...prev, newUserMessage]);
		processMessageToGeminiAPI(question); //sends message as middleman
	};

	const handleSend = () => {
		if (!input.trim()) return;

		const time = getFormattedTime();
		const newUserMessage: Message = {
			text: input,
			sender: 'user',
			time,
			read: true,
		};
		setMessages((prev) => [...prev, newUserMessage]);
		setInput('');
		processMessageToGeminiAPI(newUserMessage.text);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSend();
		}
	};

	useEffect(() => {
		const handleClickOrEsc = (event: MouseEvent | KeyboardEvent) => {
			// Close if clicked outside the dropdown
			if (
				event instanceof MouseEvent &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
				setShowPredefinedQuestions(true);
			}

			// Close if Escape key is pressed
			if (event instanceof KeyboardEvent && event.key === 'Escape') {
				setDropdownOpen(false);
				setShowPredefinedQuestions(true);
			}
		};

		if (dropdownOpen) {
			document.addEventListener('mousedown', handleClickOrEsc);
			document.addEventListener('keydown', handleClickOrEsc);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOrEsc);
			document.removeEventListener('keydown', handleClickOrEsc);
		};
	}, [dropdownOpen]);

	useEffect(() => {
		if (!dropdownOpen) {
			setMessages([]);
			setShowPredefinedQuestions(true); // reset predefined questions visibility if needed
		}
	}, [dropdownOpen]);
	// Fetch bot response
	const processMessageToGeminiAPI = async (userMessage: string) => {
		setMessages((prev) => [
			...prev,
			{ text: 'Loading your answer...', sender: 'bot', time: '', read: true },
		]);
		const apiRequestBody = { contents: [{ parts: [{ text: userMessage }] }] };

		try {
			const API_KEY = process.env.NEXT_PUBLIC_API_GENERATIVE_LANGUAGE_CLIENT;

			// console.log(
			// 	'API Key:',
			// 	process.env.NEXT_PUBLIC_API_GENERATIVE_LANGUAGE_CLIENT
			// );

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
				'No response from bot';
			const botTime = getFormattedTime();
			setMessages((prev) => [
				...prev.slice(0, -1),
				{ text: botMessage, sender: 'bot', time: botTime, read: true },
			]);
		} catch (error) {
			console.error('Error fetching from Google Gemini API:', error);
			setMessages((prev) => [
				...prev.slice(0, -1),
				{
					text: 'Sorry - Something went wrong. Please try again!',
					sender: 'bot',
					time: '',
					read: true,
				},
			]);
		}
	};

	return (
		<li className="relative list-none">
			<button
				className="relative flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
				onClick={() => setDropdownOpen(!dropdownOpen)}
			>
				💬
			</button>

			{dropdownOpen && (
				<div
					ref={dropdownRef}
					className="absolute text-gray-800 -right-16 mt-2.5 flex h-100 w-[280px] sm:w-80 flex-col rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:-right-16"
				>
					<div className="flex items-center justify-between bg-indigo-600 rounded-t-xl border-[0.5px] text-white p-3">
						<div className="flex items-center">
							<Image
								src={robotic}
								alt="Logo"
								width={32}
								height={32}
								className="w-8 h-8"
							/>
							<div className="ml-3">
								<p className="text-sm font-bold">Budget Breeze</p>
								<p className="text-xs text-green-400">● Online</p>
							</div>
						</div>
						<button
							className="text-white text-xl font-bold"
							onClick={() => {
								setDropdownOpen(false);
								setShowPredefinedQuestions(true);
							}}
						>
							×
						</button>
					</div>

					{showPredefinedQuestions && (
						<div className="flex-1 overflow-y-auto space-y-2">
							<div className="flex flex-wrap justify-end space-y-2 p-3 bg-gray-100 dark:bg-gray-800">
								{predefinedQuestions.map((question, index) => (
									<button
										key={index}
										onClick={() => handlePredefinedQuestionClick(question)}
										className="inline-block px-4 py-2 max-w-xs border border-stroke text-sm text-right bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
									>
										{question}
									</button>
								))}
							</div>
						</div>
					)}
					{!showPredefinedQuestions && (
						<div className="flex-1 max-h-[300px] overflow-y-auto space-y-2 p-3">
							{messages.map((msg, index) => (
								<div
									key={index}
									className={`text-sm ${
										msg.sender === 'user' ? 'text-right' : 'text-left'
									}`}
								>
									<div
										className={`inline-block px-4 py-2 rounded-lg max-w-xs ${
											msg.sender === 'user'
												? 'bg-indigo-600 text-white'
												: 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
										}`}
									>
										{msg.sender === 'bot' ? (
											<ReactMarkdown>{msg.text}</ReactMarkdown>
										) : (
											msg.text
										)}
									</div>
									<div className="text-gray-400 text-xs mt-1">{msg.time}</div>
								</div>
							))}
						</div>
					)}

					<div className="flex t-1 items-center border-t p-3">
						<input
							type="text"
							className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
							placeholder="Type your message here..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyPress}
						/>
						<BiSend
							onClick={handleSend}
							size={24}
							className="flex-shrink-0 ml-2 cursor-pointer hover:scale-110 transition-transform text-indigo-600 dark:text-indigo-400"
						/>
					</div>
				</div>
			)}
		</li>
	);
};

export default DropdownMessage;
