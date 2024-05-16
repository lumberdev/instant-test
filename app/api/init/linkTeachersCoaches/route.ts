import db from '@/lib/instant/dbAdmin';
import { tx, id } from '@instantdb/admin';
import { DummyProfiles } from '@/lib/instant/mockData';

export async function POST(request: Request) {
	const res = await request.json();
	const { coachEmail, teacherEmail } = res;
	const data = await db.query({
		profiles: {},
	});
	const { profiles } = data;

	const coachId = profiles.find((profile) => profile.email === coachEmail).id;
	const teacherId = profiles.find(
		(profile) => profile.email === teacherEmail
	).id;
	db.transact([
		tx.profiles[coachId].link({
			assignedTeachers: teacherId,
		}),
	]);

	return Response.json({ res });
}
