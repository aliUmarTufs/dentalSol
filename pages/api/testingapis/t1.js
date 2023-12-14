import prisma from "../../../lib/prismaClient";

export default async function handler(req, res) {
  try {
    const feed = await prisma.products.findMany({
      where: { id: "c2e76d65-028c-469b-83c6-3bf06c56bc18" },
      include: {
        organizations: true,
      },
    });
    // console.log(feed);
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };

    return res.status(200).send({ feed });
    
  } catch (error) {
    return res.status(200).send({
      message: error?.message,
    });
  }
}
