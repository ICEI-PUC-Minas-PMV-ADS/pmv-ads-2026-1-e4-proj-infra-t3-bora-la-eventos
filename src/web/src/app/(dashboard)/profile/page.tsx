import { getCurrentUser } from "@/actions/users.action";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
	const user = await getCurrentUser();

	return (
		<div className="max-w-3xl mx-auto px-8 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Meu perfil</h1>
				<p className="text-sm text-gray-500 mt-1">
					Gerencie os dados do organizador exibidos na plataforma.
				</p>
			</div>

			<ProfileForm user={user} />
		</div>
	);
}
