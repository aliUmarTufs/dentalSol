import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";
import { prisma } from "../../../lib/prismaClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    try {
      await prisma.$transaction(async (tx) => {
        let responseObj = {
          categoriesCount: 0,
          categoryPrice: 0,
        };
        let r = [];
        if (getData?.user_id) {
          let subcategoryCount =
            await prisma.vendor_subcategory_assigned.findMany({
              where: { user_id: getData?.user_id },
            });
          if (subcategoryCount) {
            responseObj.categoriesCount = subcategoryCount?.length;
          }

          BigInt.prototype.toJSON = function () {
            return this.toString();
          };

          res.status(200).send({
            status: true,
            message: "Data Found",
            data: responseObj,
          });
        } else {
          res
            .status(400)
            .send({ status: false, message: "User is required", data: {} });
        }
      });
    } catch (error) {
      res.status(400).send({ message: error?.message });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
