import { supabase, supabase_admin_secret } from "../../../lib/supabaseClient";
import nc from "next-connect";
import multer from "multer";
const handler = nc();
export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
};

let storage = multer.diskStorage({
	destination: function (req, res, cb) {
		return cb(null, "public");
	},
	filename: function (req, file, cb) {
		return cb(null, file.originalname);
	},
});
const upload = multer({
	storage: storage,
});

let uploadFile = upload.single("image");

handler.use(uploadFile);

handler.post(async (req, res) => {
	try {
		let random = Math.random() * Math.random();
		const { data, error } = await supabase_admin_secret.storage
			.from("notable-figures")
			.upload(`users/${req.file.filename}`, req.file, {
				cacheControl: "3600",
				upsert: false,
			});
		if (data) {
			res.status(200).send({
				status: true,
				message: "Image has been uploaded",
				data: data,
			});
		} else {
			res.status(400).send({
				status: false,
				message: "error occured",
				data: error,
			});
		}
		// res.status(200).send({ message: "Uploaded" , data: req.body});
	} catch (error) {
		res.status(200).send({ message: "Uploaded" });
	}
});
export default handler;

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const getData = req.body;
//     let random = Math.random() * Math.random();
//     if (getData.image) {
//       const { data, error } = await supabase.storage
//         .from("notable-figures")
//         .upload(`users/${random}`, getData.image, {
//           cacheControl: "3600",
//           upsert: false,
//         });
//       if (data) {
//         res.status(200).send({
//           status: true,
//           message: "Image has been uploaded",
//           data: data,
//         });
//       } else {
//         res.status(400).send({
//           status: false,
//           message: "error occured",
//           data: error,
//         });
//       }
//     } else {
//       res.status(400).send({
//         status: false,
//         message: "Image Required",
//       });
//     }
//   } else {
//     res.status(405).send({ message: "Only POST requests allowed" });
//   }
// }
