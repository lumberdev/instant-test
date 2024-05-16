import db from '@/lib/instant/dbAdmin';
import { tx, id } from '@instantdb/admin';
import { DummyProfiles } from '@/lib/instant/mockData';

export async function GET() {
	const data = await db.query({
		profileTypes: {},
	});
	const { profileTypes } = data;

	DummyProfiles.forEach((profile) => {
		const { email, type } = profile;
		const profileTypeId = profileTypes.find(
			(profileType) => type === profileType.type
		).id;
		db.transact([
			tx.profiles[id()].update({ email }).link({ types: profileTypeId }),
		]);
	});

	return Response.json({ profileTypes });
}
