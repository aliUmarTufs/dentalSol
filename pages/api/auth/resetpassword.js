import { BASE_URL } from "../../../constants";
import { supabase, supabase_admin_secret } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getBody = req.body;
    if (getBody.password) {
      const d = await supabase_admin_secret.auth.api.updateUser(
        getBody.accessToken,
        {
          password: getBody.password,
        }
      );
      if (d.data) {
        res.status(200).send({
          status: true,
          message: "Password has been updated successfully.",
        });
      } else {
        res.status(400).send({
          status: false,
          message: d?.error?.message,
        });
      }
    } else {
      res
        .status(400)
        .send({ status: false, message: "Email or Password required" });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
