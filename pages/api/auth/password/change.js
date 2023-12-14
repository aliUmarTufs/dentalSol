import {
	supabase,
	supabase_admin_secret,
} from "../../../../lib/supabaseClient";

export default async function handle(req, res) {
	if (req.method === "POST") {
		try {
			const getData = req.body;
			let authToken = req.headers.authorization;
			let refreshToken = req.headers.refreshtoken;
			let userId = req.headers.userid;
			let email = req.headers.email;

			//check old password is valid
			const checkOldPassword = await supabase_admin_secret.auth.signIn({
				email: email,
				password: getData?.old_password,
			});

			if (!checkOldPassword?.data) {
				return res.status(400).send({
					status: false,
					message: `Error occured - Old password is not valid`,
				});
			} else {
				const data = await supabase_admin_secret.auth.api.getUser(authToken);
				if (data?.data) {
					const updateUser =
						await supabase_admin_secret.auth.api.updateUserById(
							data?.data?.id,
							{ password: getData?.new_password }
						);
					console.log({ updateUser });
					if (updateUser?.user && updateUser?.data) {
						return res.status(200).send({
							status: true,
							message: "Password has been changed",
							data: updateUser?.data,
							d: data,
						});
					} else {
						return res.status(400).send({
							status: false,
							message: `Error occured - ${updateUser?.error?.message}`,
						});
					}
				} else {
					const refreshT = await supabase_admin_secret.auth.signIn({
						email: email,
						password: getData?.old_password,
					});
					if (refreshT?.data) {
						const updateUser =
							await supabase_admin_secret.auth.api.updateUserById(
								refreshT?.data?.user?.id,
								{ password: getData?.new_password }
							);
						if (updateUser?.user && updateUser?.data) {
							return res.status(200).send({
								status: true,
								message: "Password has been changed",
								data: updateUser?.data,
							});
						} else {
							return res.status(400).send({
								status: false,
								message: `Error occured - ${updateUser?.error?.message}`,
							});
						}
					} else {
						return res.status(400).send({
							status: false,
							// message: `Error occured - ${
							//   refreshT?.error
							//     ? `${refreshT.error.message} Or`
							//     : "Old password is not valid"
							// }  `,
							message: `Error occured - Old password is not valid`,
						});
					}
				}
			}
		} catch (error) {
			res.status(400).json({ status: false, message: error.message });
		}
	} else {
		res.status(405).send({ message: "Only POST requests allowed" });
	}
}
