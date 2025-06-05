import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { Toaster, toast } from 'react-hot-toast';
import useColorMode from '../components/navbar-content/useColorMode';

export async function signUp(
	email: string,
	password: string,
	displayName: string
) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				display_name: displayName, // Store the display name in user_metadata
			},
		},
	});
	return { data, error };
}

export async function signIn(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	return { data, error };
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();
	return { error };
}

export async function getUser() {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

//authentication hook
export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const {
			data: { subscription },
			//function listens for changes in the user authentication state
		} = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		// like a break call but for listening for auth state
		return () => subscription.unsubscribe();
	}, []);

	const signOutAndRedirect = async () => {
		await signOut();
		toast.success('Until next time!', {
			className: 'text-xl p-4 min-w-[300px]',
		});
		router.push('/signin');
	};

	return { user, loading, signUp, signIn, signOutAndRedirect, getUser };
}
