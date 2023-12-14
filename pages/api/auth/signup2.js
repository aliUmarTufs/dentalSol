import _ from "lodash";
import {
  createCustomerInfo,
  createLead,
  createVendorInfo,
  refreshToken,
} from "../../../zoho";
import { supabase, supabase_admin_secret } from "../../../lib/supabaseClient";
import { prisma } from "../../../lib/prismaClient";

const { createClient } = require("@supabase/supabase-js");
// const supabase = createClient(
//   "https://thqoivzegkzbttgdugai.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocW9pdnplZ2t6YnR0Z2R1Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcyOTgyNTgsImV4cCI6MTk4Mjg3NDI1OH0.xB-GJIPo_xKNVflI2dFrf2ja-Nh_2_QHX1qKShh1Raw"
// );

export default async function SignUp(req, res) {
  let refreshTokenFunc = await refreshToken();

  if (req.method === "POST") {
    try {
      const getData = req.body;
      if (getData.email && getData.password) {
        let checkEmail = await supabase
          .from("users")
          .select("*")
          .eq("user_email", getData.email)
          .eq("is_deleted", 0);
        if (checkEmail.data.length > 0) {
          res.status(400).json({
            status: false,
            data: {},
            message: "Email already exist",
          });
        } else {
          let obj = {
            user_name: getData.name,
            user_email: getData.email,
            office_number: getData.practiceName,
            office_address: getData.practiceAddress,
            phone_number: getData.phoneNumber,
            user_city: getData.city,
            user_country: getData.country,
            user_state: getData.state,
            user_type_list: getData.userTypeList,
            username: getData.username,
            areas_of_interest: getData.areasOfInterest,
            role_type: getData.roleType,
            image: getData.profileImg,
            zip_code: getData?.zip_code,
            vendor_categories: getData?.vendor_categories,
            services_list: getData?.services_list,
          };
          // if (getData?.vendor_categories) {
          //   let mapVendorCategories = [];
          //   getData?.vendor_categories?.map((e) => {
          //     mapVendorCategories.push({
          //       category_id: e,
          //     });
          //   });
          //   obj.vendor_categories_assinged = {
          //     create: mapVendorCategories,
          //   };
          // }
          // if (getData?.services_list) {
          //   let mapVendorServices = [];
          //   getData?.services_list?.map((e) => {
          //     mapVendorServices.push({
          //       service_id: e,
          //     });
          //   });
          //   obj.services_assigned = {
          //     create: mapVendorServices,
          //   };
          // }

          const createuser2 = await prisma.users.create({
            data: obj,
          });
          // const createUser = await supabase.from("users").insert(obj);
          if (!createuser2) {
            res.status(400).json({
              status: false,
              message: "Error Occured while signup",
            });
          } else {
            if (createuser2) {
              let organizationPayload = {
                name: getData?.organization_name,
                organization_user: createuser2?.id,
              };

              let createOrganization = await supabase
                .from("organizations")
                .insert(organizationPayload);
              if (
                createOrganization?.data &&
                createOrganization?.data?.length > 0
              ) {
                let splitFullName = getData?.name.split(" ");

                const signupUser =
                  await supabase_admin_secret.auth.api.createUser({
                    email: getData.email,
                    password: getData.password,
                    email_confirm: true,
                    // user_metadata: obj,
                  });

                  console.log({signupUser});
                if (signupUser.error) {
                  let deleteUser = await supabase
                    .from("users")
                    .delete()
                    .eq("id", createuser2?.id);
                  if (deleteUser.error) {
                    res.status(400).json({
                      status: false,
                      data: deleteUser.error,
                      message: deleteUser.error.message,
                    });
                  }
                } else {
                  let subs = false;
                  const getSubscribed = await supabase
                    .from("subscribers")
                    .select("*")
                    .eq("email", createuser2?.user_email);
                  if (getSubscribed?.data && getSubscribed?.data?.length > 0) {
                    subs = true;
                  }

                  let user = await supabase
                    .from("users")
                    .select("* , user_city(*)")
                    .eq("id", createuser2?.id);
                  if (user?.data && user?.data?.length > 0) {
                    user.data[0].subs = subs;

                    let zohoUser;
                    let zohoVendorAsCustomer;
                    /* create zoho leads API call */
                    await createLead(refreshTokenFunc, {
                      Company: getData.practiceName,
                      First_Name:
                        !_.isEmpty(splitFullName[0]) &&
                        !_.isUndefined(splitFullName[0])
                          ? splitFullName[0]
                          : getData.name,
                      Last_Name:
                        !_.isEmpty(splitFullName[1]) &&
                        !_.isUndefined(splitFullName[1])
                          ? splitFullName[1]
                          : " ",
                      Email: getData.email,
                      State: getData.state,
                      Zip_Code: getData.zip_code,
                      City: getData?.cityName,
                      Country: getData.country,
                      Lead_Source: getData.roleType,
                      Phone: getData.phoneNumber,
                    });
                    if (user?.data[0]?.role_type == "User") {
                      /* zoho API call for adding customers(user) to zoho and save zoho id against new user */
                      let customerObj = {
                        contact_name: getData?.name,
                        contact_type: "customer",
                        billing_address: {
                          attention: getData?.name,
                          address: getData?.practiceAddress ?? "",
                          country: getData?.country,
                          city: getData?.cityName,
                          state: getData?.state,
                          zip: getData?.zip_code,
                          fax: getData?.phoneNumber,
                          phone: getData?.phoneNumber,
                        },
                        shipping_address: {
                          attention: getData?.name,
                          address: getData?.practiceAddress ?? "",
                          country: getData?.country,
                          city: getData?.cityName,
                          state: getData?.state,
                          zip: getData?.zip_code,
                          fax: getData?.phoneNumber,
                          phone: getData?.phoneNumber,
                        },
                      };
                      zohoUser = await createCustomerInfo(
                        refreshTokenFunc,
                        customerObj
                      );
                      await supabase
                        .from("users")
                        .update({
                          vendor_zoho_id: zohoUser?.contact?.contact_id,
                        })
                        .eq("id", createuser2?.id);
                    } else if (user?.data[0]?.role_type == "Vendor") {
                      /* zoho API call for adding vendors to zoho and save zoho id against new user */
                      let vendorObj = {
                        Vendor_Name: getData?.name,
                        Email: getData?.email,
                        Street: getData?.practiceAddress,
                        Phone: getData?.phoneNumber,
                        State: getData?.state,
                        City: getData?.cityName,
                        Zip_Code: getData?.zip_code,
                        Country: getData?.country,
                        Description: getData?.short_bio,
                      };
                      let vendorAsCustomerObj = {
                        contact_name: getData?.name,
                        contact_type: "vendor",
                        billing_address: {
                          attention: getData?.name,
                          address: getData?.practiceAddress ?? "",
                          country: getData?.country,
                          city: getData?.cityName,
                          state: getData?.state,
                          zip: getData?.zip_code,
                          fax: getData?.phoneNumber,
                          phone: getData?.phoneNumber,
                        },
                        shipping_address: {
                          attention: getData?.name,
                          address: getData?.practiceAddress ?? "",
                          country: getData?.country,
                          city: getData?.cityName,
                          state: getData?.state,
                          zip: getData?.zip_code,
                          fax: getData?.phoneNumber,
                          phone: getData?.phoneNumber,
                        },
                      };

                      zohoUser = await createVendorInfo(
                        refreshTokenFunc,
                        vendorObj
                      );
                      zohoVendorAsCustomer = await createCustomerInfo(
                        refreshTokenFunc,
                        vendorAsCustomerObj
                      );

                      await supabase
                        .from("users")
                        .update({
                          vendor_zoho_id: zohoUser?.data[0]?.details?.id,
                          vendor_zoho_book_id:
                            zohoVendorAsCustomer?.contact?.contact_id,
                        })
                        .eq("id", createuser2?.id);
                    } else {
                      null;
                    }

                    res.setHeader(
                      "Set-Cookie",
                      serialize("user_token", userData?.data[0]?.id, {
                        path: "/",
                      })
                    );

                    res.status(200).json({
                      status: true,
                      data: user.data[0],
                      message: "Your Dent247 account has been created.",
                    });
                  } else {
                    res.status(400).json({
                      status: false,
                      message: "Error Occured - User may not be found",
                    });
                  }
                }
              } else {
                res.status(400).json({
                  status: false,
                  message: "Organization Creation Failed",
                });
              }
            }
          }
        }
      } else {
        res
          .status(400)
          .json({ status: false, message: "Email or Password required" });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Something went wrong. Error Occured",
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
