import db from '@/lib/instant/dbAdmin';
import { tx, id } from '@instantdb/admin';

export async function POST(request: Request) {
	// const data = await db.query({
	// 	teachers: {},
	// 	students: {},
	// 	leaders: {},
	// });
	// const { teachers, students, leaders } = data;
	const res = await request.json();
	const { email } = res;
	// 1. Check if the email is in the profiles
	const profileQuery = {
		profiles: {
			$: {
				where: {
					email,
				},
			},
			types: {},
		},
	};
	const profileData = await db.query(profileQuery);
	const { profiles } = profileData;

	// Return early and throw error if no profiles are found
	// Can show up popup to contact support
	if (profiles.length === 0) {
		return Response.error();
	}

	switch (profiles[0].types[0].type) {
		case 'teacher':
			const teachersQuery = {
				teachers: {
					$: {
						where: {
							'profiles[0].id': profiles[0].id,
						},
					},
					types: {},
				},
			};
			const teachersData = await db.query(teachersQuery);
			const { teachers } = teachersData;
			if (teachers.length === 0) {
				// create teacher
				await db.transact([
					tx.teachers[id()]
						.update({ tenure: 10 })
						.link({ profile: profiles[0].id }),
				]);
			}
			break;
		case 'coach':
			const coachesQuery = {
				coaches: {
					$: {
						where: {
							'profiles[0].id': profiles[0].id,
						},
					},
					types: {},
				},
			};
			const coachesData = await db.query(coachesQuery);
			const { coaches } = coachesData;
			console.log(profiles[0].id);
			if (coaches.length === 0) {
				// create teacher
				await db.transact([
					tx.coaches[id()]
						.update({ tenure: 10 })
						.link({ profile: profiles[0].id }),
				]);
			}
			break;
		case 'leader':
      const leadersQuery = {
				leaders: {
					$: {
						where: {
							'profiles[0].id': profiles[0].id,
						},
					},
					types: {},
				},
			};
			const leadersData = await db.query(leadersQuery);
			const { leaders } = leadersData;
			console.log(profiles[0].id);
			if (leaders.length === 0) {
				// create teacher
				await db.transact([
					tx.leaders[id()]
						.update({ tenure: 10 })
						.link({ profiles: profiles[0].id }),
				]);
			}
			break;
	}

	return Response.json({ email });
}
