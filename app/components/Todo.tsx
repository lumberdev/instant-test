'use client';

import { init, tx, id } from '@instantdb/react';

import { useState, useRef } from 'react';

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

// Replace this with your own App ID from https://instantdb.com/dash
const APP_ID = process.env.NEXT_PUBLIC_APP_ID;

// Initialize connection to InstantDB app
const db = init({ appId: APP_ID });

type User = {
	id: string;
	email: string;
	refresh_token: string;
};

function Todo({ user }: { user: User }) {
	// Read from InstantDB
	const { isLoading, error, data } = db.useQuery({ messages: {} });
	const inputRef = useRef(null);
	const [editId, setEditId] = useState(null);

	if (isLoading) {
		return <div>Fetching data...</div>;
	}
	if (error) {
		return (
			<div className='p-2 font-mono'>
				Invalid `APP_ID`. Go to{' '}
				<a
					href='https://instantdb.com/dash'
					className='underline text-blue-500'>
					https://instantdb.com/dash
				</a>{' '}
				to get a new `APP_ID`
			</div>
		);
	}
	const { messages } = data;

	const onSubmit = () => {
		console.log('(TODO): Add message');
		db.transact([tx.messages[id()].update({ text: inputRef.current.value })]);
	};

	const onKeyDown = (e: any) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSubmit();
		}
	};

	return (
		<div className='p-4 space-y-6 w-full sm:w-[640px] mx-auto'>
			<h1 className='text-2xl font-bold'>Logged in as: {user.email}</h1>
			<Button
				onClick={() => {
					console.log('(TODO) Sign out');
					db.auth.signOut();
				}}>
				Sign out
			</Button>
			<div className='flex flex-col space-y-2'>
				<div className='flex justify-between border-b border-b-gray-500 pb-2 space-x-2'>
					<div className='flex flex-1'>
						<input
							ref={inputRef}
							className='flex-1 py-1 px-2 focus:outline-2 focus:outline-amber-500'
							autoFocus
							placeholder='Enter some message...'
							onKeyDown={onKeyDown}
							type='text'
						/>
					</div>
					<Button onClick={onSubmit}>Submit</Button>
				</div>
				<div className='truncate text-xs text-gray-500'>
					(TODO) Replace me with a typing indicator!
				</div>
			</div>

			<div className='space-y-2'>
				{messages.map((message) => (
					<div key={message.id}>
						{editId === message.id ? (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									console.log('(TODO) Implement update message');
									db.transact([
										tx.messages[message.id].update({
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
											db.transact([tx.messages[message.id].delete()]);
										}}>
										Delete
									</Button>
								</span>
							</div>
						)}
					</div>
				))}
			</div>
			<div className='border-b border-b-gray-300 pb-2'>
				(TODO) Who's online:
			</div>
			<Button
				onClick={() => {
					console.log('(TODO) Implement delete all');
					db.transact(messages.map((m) => tx.messages[m.id].delete()));
				}}>
				Delete All
			</Button>
		</div>
	);
}

export default Todo;
