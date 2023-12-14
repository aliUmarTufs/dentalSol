import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";
import { prisma } from "../../../lib/prismaClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    try {
      await prisma.$transaction(async (tx) => {
        // Code running in a transaction...
        let obj = {
          services: false,
          user_category: false,
        };
        let userSelectedArr = [];
        if (
          getData?.services &&
          getData?.user_selected_categories &&
          getData?.user_id
        ) {
          const getUser = await prisma.users.findUnique({
            where: { id: getData?.user_id },
          });
          if (getUser) {
            if (getData?.services && getData?.services?.length > 0) {
              let serviceArr = [];
              getData?.services?.map((e) => {
                serviceArr.push({
                  user_id: getData?.user_id,
                  service_id: e,
                });
              });
              const addServices = await tx.services_assigned.createMany({
                data: serviceArr,
                skipDuplicates: true,
              });

              BigInt.prototype.toJSON = function () {
                return this.toString();
              };

              if (addServices) {
                obj.services = true;
              }
              // res.status(200).send({ addServices });
            }

            if (
              getData?.user_selected_categories &&
              getData?.user_selected_categories?.length > 0
            ) {
              getData?.user_selected_categories?.map((e) => {
                let subcateogryArr = [];
                if (e?.categories && e?.categories?.length > 0) {
                  e?.categories?.map((i) => {
                    let pushObj = {
                      category_type: e?.type,
                      user_id: getData?.user_id,
                      parent_category_id: i?.key_id,
                    };
                    if (i?.subcategory && i?.subcategory?.length > 0) {
                      i?.subcategory?.map((k) => {
                        subcateogryArr.push({
                          sub_category_id: k?.sub_unique_id,
                          user_id: getData?.user_id,
                        });
                      });
                    }

                    pushObj.vendor_subcategory_assigned = {
                      create: subcateogryArr,
                    };

                    userSelectedArr.push(pushObj);
                  });
                }
              });
              // const addServices = await tx.services_assigned.createMany({
              //   data: userSelectedArr,
              //   skipDuplicates: true,
              // });

              // res.status(200).send({ addServices });
              if (userSelectedArr && userSelectedArr?.length > 0) {
                for (let i = 0; i < userSelectedArr?.length; i++) {
                  const addCat = await tx.vendor_categories_assinged.create({
                    data: userSelectedArr[i],
                  });
                }
                obj.user_category = true;
              }
            }
          }
          if (obj?.services && obj?.user_category) {
            res.status(200).send({
              status: true,
              message: "Profile has beend save successfully.",
              data: {},
            });
          } else {
            res.status(400).send({
              status: false,
              message: "Error Occured.",
              data: {},
            });
          }
        } else {
          res.status(200).send({ addServices: "categories required" });
        }
      });
    } catch (err) {
      res.status(400).send({ status: false, message: err.message });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
