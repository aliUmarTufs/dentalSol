import prisma from "../../../lib/prismaClient";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      let getData = req.body;
      let errorCount = 0;
      let obj = {
        userTypeList: [],
        areasOfInterest: [],
        citiesData: [],
      };
      const userTypeList = await supabase.from("user_type_list").select("*");

      if (userTypeList?.data) {
        obj.userTypeList = userTypeList?.data;
      } else {
        errorCount += 1;
      }
      const areasOfInterest = await supabase
        .from("areas_of_interest")
        .select("*");
      if (areasOfInterest?.data) {
        obj.areasOfInterest = areasOfInterest?.data;
      } else {
        errorCount += 1;
      }

      const citiesData = await supabase.from("cities").select("*");
      if (citiesData?.data) {
        obj.citiesData = citiesData?.data;
      } else {
        errorCount += 1;
      }
      if (getData?.user_id) {
        let findUserOrganization = await prisma.organizations.findMany({
          where: {
            organization_user: getData?.user_id,
          },
        });

        BigInt.prototype.toJSON = function () {
          return this.toString();
        };
        if (findUserOrganization) {
          obj.userOrgList = findUserOrganization;
          if (findUserOrganization?.length > 0) {
            obj.userOrgData = findUserOrganization[0];
          }
        }
      }

      if (errorCount > 0) {
        res.status(400).send({
          status: false,
          message: `Error Occured `,
        });
      } else {
        res.status(200).send({
          status: true,
          message: "Data Found",
          data: obj,
        });
      }
    } catch (error) {
      res.status(400).send({ status: false, message: error?.message });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only GET requests allowed" });
  }
}
