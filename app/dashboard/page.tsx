'use client';

import { tx } from '@instantdb/react';

import { useState, useRef } from 'react';
import Router from 'next/navigation';
import db from '@/lib/instant/db';

// ---------
// Helpers
// ---------
function Button({ children, onClick }) {
	return (
		<button
			className='px-2 py-1 outline hover:bg-gray-200 focus:outline-amber-500 focus:outline-2'
			onClick={onClick}>
			{children}
		</button>
	);
}

// ---------
// App
// ---------

type User = {
	id: string;
	email: string;
	refresh_token: string;
};

function Todo() {
	const router = Router.useRouter();
	const { isLoading: isLoadingUser, user, error: errorUser } = db.useAuth();
	const [userType, setUserType] = useState(null);
	// Read from InstantDB
	const { isLoading, error, data } = db.useQuery({
		roster: {},
		profiles: {
			types: {},
		},
		profileTypes: {},
	});
	const [editId, setEditId] = useState(null);

	if (isLoading || isLoadingUser) {
		return <div>Fetching data...</div>;
	}
	if (error || errorUser) {
		router.push('/');
	}
	const { roster, profiles, profileTypes } = data;
	console.log('dashboard Profiles', profiles);

	const onSubmit = () => {
		console.log('(TODO): Add message');

		// //create profile type
		// db.transact([tx.profileTypes[id()].update({ type: 'coach' })]);

		// //linking profile
		// const uuid = profileTypes.find((ut) => ut.type === 'coach').id;
		// console.log(uuid);
		// db.transact([
		// 	tx.profiles[id()]
		// 		.update({ email: 'pratik+coach@lumber.dev' })
		// 		.link({ type: uuid }),
		// ]);

		// //create profile with type
		// const profileId = profiles.find(
		// 	(profile) => profile.email === 'pratik+leader@lumber.dev'
		// ).id;
		// console.log(profileId);
		// db.transact([tx.profiles[profileId].update({ profileType: 'leader' })]);
	};

	const onKeyDown = (e: any) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSubmit();
		}
	};

	const getProfileType = (email: string) => {
		const targetProfile = profiles.find((profile) => profile.email === email);
		return targetProfile ? targetProfile.types[0].type : '';
	};
	return (
		<div className='p-4 space-y-6 w-full sm:w-[640px] mx-auto'>
			<h1 className='text-xl font-bold'>Logged in as: {user.email}</h1>
			<div className='flex justify-between items-center pb-10'>
				<h1 className='text-xl font-bold'>
					Profile Type: {getProfileType(user.email) || 'unset'}
				</h1>
				<Button
					onClick={() => {
						console.log('(TODO) Sign out');
						db.auth.signOut();
						router.push('/');
					}}>
					Sign out
				</Button>
			</div>

			<div>
				<div className='flex justify-between'>
					<h1 className='text-lg font-bold'>Profiles</h1>
					<h1 className='text-lg font-bold'>Type</h1>
				</div>
				{profiles.map((profile) => (
					<div key={profile.id} className='flex justify-between'>
						<p>{profile.email}</p>
						<p>{profile.types[0].type}</p>
					</div>
				))}
			</div>

			<div className='space-y-2'>
				{roster.map((message) => (
					<div key={message.id}>
						{editId === message.id ? (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									console.log('(TODO) Implement update message');
									db.transact([
										tx.roster[message.id].update({
											text: e.target[0].value,
										}),
									]);
									setEditId(null);
								}}>
								<input defaultValue={message.text} autoFocus type='text' />
							</form>
						) : (
							<div className='flex justify-between'>
								<p>(TODO) Show message author: {message.text}</p>
								<span className='space-x-4'>
									<Button onClick={() => setEditId(message.id)}>Edit</Button>
									<Button
										onClick={() => {
											console.log('(TODO) Implement delete message');
											db.transact([tx.roster[message.id].delete()]);
										}}>
										Delete
									</Button>
								</span>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default Todo;
