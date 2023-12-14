import _ from "lodash";
import { supabase } from "../../../../lib/supabaseClient";
import { prisma } from "../../../../lib/prismaClient";
import { CATCH_ERROR_MESSAGE } from "../../../../constants";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const getData = req.body;
      if (getData?.user_id) {
        let getUser = await prisma.users.findUnique({
          where: {
            id: getData?.user_id,
          },
          include: {
            vendor_categories_assinged: true,
            services_assigned: {
              include: {
                services_list: true,
              },
            },
          },
        });
        BigInt.prototype.toJSON = function () {
          return this.toString();
        };
        if (getUser) {
          console.log(getUser.services_assigned);
          let filterService = _.map(getUser?.services_assigned, (e) => {
            return e?.services_list?.service_type?.toLowerCase();
          });
          getUser.filterService = filterService;

          res.status(200).send({
            status: true,
            message: "Data Successfully Found",
            data: getUser,
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: "User required",
        });
      }
    } catch (error) {
      res.status(400).send({
        status: false,
        message: error?.message,
      });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
