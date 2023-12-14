export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(req.body);
    return res.status(200).send({
      ok: "k",
    });
  } else {
        return res.status(405).send({
        message: "Method not defined",
        });
  }
}
