// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { stripe_payment } from "../../constants";
import { supabase } from "../../lib/supabaseClient";
import _ from "lodash";
import { algoliaClientAdmin } from "../../lib/algoliaClient";
import moment from "moment/moment";
// const cron = require('node-cron');

// cron.schedule('* * * * * *', () => {
//   a = 0
//   console.log('running a task every minute' , a);
//   a +=1
// });

// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

export default async function handler(req, res) {
  // let arr = [];
  // let getCourses = await supabase.from("courses").select("*");
  // if (getCourses?.data && getCourses?.data?.length > 0) {
  //   getCourses?.data?.map((e) => {
  //     arr.push({
  //       objectID: e?.id,
  //       is_approved: e?.is_approved,
  //     });
  //   });
  // }

  //Articles

  // let articleData = await supabase
  //   .from("articles")
  //   .select(
  //     "* , notable_figures(*),users(*) , article_categories(*) , article_category_filters(*) , organizations(*)  "
  //   );
  // if (articleData.data) {
  //   let d = articleData.data.map((e) => {
  //     e.authorUser = e?.users;
  //     e.article_categories = e?.article_categories;
  //     e.category = e?.article_categories;
  //     e.author = e?.notable_figures;
  //     e.objectID = e?.id;
  //     e.is_approved = 1;
  //   });
  // }

  //Courses

  // const getArticlesCount = await supabase
  //   .from("courses")
  //   .select("* ,  organization(*)")
  //   .range(800,1000);
  // getArticlesCount?.data?.map((item) => {
  //   item.objectID = item?.id;
  //   item.organization_detail = item?.organization;
  //   item.organization = item?.organization?.id;
  // });

  // let direcotryUpdate = await supabase
  //   .from("directory_companies")
  //   .select("* , company(*) , directory_frontend_categories(*) ")
  //   .range(1001,1500);
  // if (direcotryUpdate.data && direcotryUpdate?.data?.length > 0) {
  //   direcotryUpdate?.data?.map((e) => {
  //     e.objectID = e.id;

  //     e.company_name = e.company_name;
  //     e.company_id = e.company?.id;

  //     e.category_id = e.directory_frontend_categories?.id;
  //     e.category_name = e.directory_frontend_categories?.name;

  //     e.company = e?.company;

  //     delete e.category;
  //   });

  // delete bodyData.record.company;

  // let account = await stripe_payment.accounts.retrieve("acct_1MgA2CQuzW3bHAcA");
  // const session = await stripe_payment.checkout.sessions.create({
  //     success_url: "https://example.com/success",
  //     cancel_url : "https://dent247.com/",
  //   line_items: [
  //     {
  //       price_data: {
  //         currency: "usd",
  //         product_data: {
  //           name: "Product1",
  //           images: ["https://i.imgur.com/EHyR2nP.png"],
  //         },
  //         unit_amount: 1899,
  //       },
  //       quantity: 1,
  //     },
  //   ],
  //   mode: "payment",
  // });
  // const paymentIntent = await stripe_payment.paymentIntents.retrieve(
  //   'pi_3MhB5lJkJTg6AUHv16jbjg1E'
  // );

  // const session = await stripe_payment.checkout.sessions.retrieve(
  //   "cs_test_a1O2ZRf8zCLXiVxRgxRqQ7wy3N2Flf1f3r5nz4dlDDVzDdMiDubfKL4voJ"
  // );

  // let getOrganizations = await supabase
  //   .from("organizations")
  //   .select("*")
  //   .eq("organization_user", "894a9089-bc5f-4202-bb17-e259109833e4");
  // if (getOrganizations?.data && getOrganizations?.data?.length > 0) {
  //   let organizationIDs = _.map(getOrganizations?.data, "id");
  //   if (organizationIDs?.length > 0) {
  //     // let d = await supabase
  //     //   .from("sales_report_month")
  //     //   .select()
  //     //   .in("organization_id", organizationIDs);
  //     // let u = _.uniqBy(d?.data, "Month");
  //     let salesMonth = await supabase.from("sales_report_month").select("*")
  //     res.status(200).send({
  //       data: salesMonth?.data,
  //     });
  //     // let sales = await supabase
  //     //   .from("purchases")
  //     //   .select("*")
  //     //   .in("organization_id", organizationIDs);
  //     // if (sales?.data) {
  //     // }
  //   } else {
  //     res.status(200).send({
  //       data: organizationIDs,
  //     });
  //   }
  // } else {
  //   res.status(200).send({
  //     data: getOrganizations,
  //   });
  // }

  // let d= await supabase.from("sales_report").select().in("organization_id" , ["59493d34-5b29-45dc-9202-bd2c80c39765"]);

  // res.status(200).send({
  //   data: JSON.stringify( {
  //     price_data: {
  //       currency: 'usd',
  //       product_data: {
  //         name: 'Product1',
  //         images: ['https://i.imgur.com/EHyR2nP.png'],
  //       },
  //       unit_amount: 1899,
  //     },
  //     quantity: 1,
  //   }),
  // });

  // let getUser = await supabase
  //   .from("users")
  //   .select("*")
  //   .eq("id", "894a9089-bc5f-4202-bb17-e259109833e4");
  // if (getUser?.data && getUser?.data?.length > 0) {
  //   let getOrganizations = await supabase
  //     .from("organizations")
  //     .select("*")
  //     .eq("organization_user", "894a9089-bc5f-4202-bb17-e259109833e4");
  //   if (getOrganizations?.data && getOrganizations?.data?.length > 0) {
  //     let organizationIDs = _.map(getOrganizations?.data, "id");
  //     let monthArr = [];
  //     let salesMonth = await supabase.from("sales_report_month").select("*");
  //     if (salesMonth?.data && salesMonth?.data?.length > 0) {
  //       salesMonth?.data?.map((e) => {
  //         e.sales = 0;
  //       });
  //     }
  //     if (organizationIDs?.length > 0) {
  //       let productListing = await supa
  //       let sales = await supabase
  //         .from("sales_report")
  //         .select("*")
  //         .in("organization_id", organizationIDs);
  //       if (sales?.data) {
  //         salesMonth?.data?.map((e) => {
  //           let mapSales = sales?.data?.map((data) => {
  //             if (e?.Month == data?.Month) {
  //               e.sales = e?.sales + data?.total;
  //             }
  //           });
  //         });

  //         res.status(200).send({
  //           data: salesMonth?.data,
  //         });
  //       }
  //       else {
  //         res.status(400).send({
  //           status: false,
  //           message: sales?.error?.message,
  //         });
  //       }
  //     }
  //   }
  //   else {
  //     res.status(400).send({
  //       status: false,
  //       message: "No organization",
  //     });
  //   }
  // } else {
  //   res.status(400).send({
  //     status: false,
  //     message: getUser?.error?.message,
  //   });
  // }
  try {
    // const paymentIntent = await stripe_payment.paymentIntents.retrieve(
    //   "pi_3MjhBwJkJTg6AUHv0yu1NZkh"
    // );

    // const { data, error } = await supabase
    //   .from("subscription_buyers")
    //   .select("*")
    //   .gte("created_at", "2023-03-05T00:00:00.000Z") // Start of the first month
    //   .lte("created_at", "2023-03-9T23:59:59.999Z");
    // let courseIndex = algoliaClientAdmin.initIndex("directory_companies");
    // const data = await supabase
    //   .from("directory_companies")
    //   .select("*")
    //   .eq("is_approved", 0).range(1000,2000);
    // if (data?.data) {
    //   let arr = [];
    //   await data?.data?.map(async (e) => {
    //     console.log(data?.data?.length , e?.id);
    //     const courseUpdateIndex = await courseIndex.partialUpdateObject({
    //       objectID: e?.id,
    //       is_approved: 1,
    //     });

    //     arr.push(courseUpdateIndex);
    //   });
    let arr = [];

    // let featuredItemList = await supabase
    //   .from("featured_slots_avail")
    //   .select("* , slot_id!inner(*)")
    //   .eq("is_expire", 0);
    // featuredItemList?.data?.map((e) => {
    //   var now = moment();
    //   const diff = now.diff(moment(e?.created_at), "hours");
    //   if (diff > e?.slot_id?.slot_hours) {
    //     arr.push(e?.id);
    //   }
    //   console.log({ e });
    // });
    const aaaaa = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjg4NzM0MjA4LCJpYXQiOjE2ODg3MzA2MDgsInN1YiI6IjdkNzYyZDdiLTY5YWItNDJjNy1iYTYyLTcwODY2Mjc4ZDFkOCIsImVtYWlsIjoidjFAeW9wbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImFyZWFzX29mX2ludGVyZXN0IjpbIkFsbCBPcHRpb25zIiwiSW1wbGFudHMiLCJJbXByZXNzaW9uIE1hdGVyaWFscyIsIkFsaWduZXIgVGhlcmFweSIsIkludHJhb3JhbCBDYW1lcmFzIiwiTWF0ZXJpYWxzIGFuZCBDb3Vyc2VzIiwiTGFib3JhdG9yeSIsIlN1cmdpY2FsIEluc3RydW1lbnRzIiwiQmxlYWNoaW5nIExpZ2h0cyIsIkVuZG9kb250aWMgSW5zdHJ1bWVudHMiLCJEZWxpdmVyeSBTeXN0ZW1zIiwiRW1lcmdlbmN5IGFuZCBNb25pdG9yaW5nIFByb2R1Y3RzIiwiQ2FyaWVzIERldGVjdG9ycyIsIkRpZ2l0YWwgRGVudGlzdHJ5IiwiU2xlZXAgRGVudGlzdHJ5IiwiQ2FiaW5ldHMgYW5kIERyYXdlcnMiLCJJbnN0cnVtZW50IENsZWFuaW5nIEJydXNoZXMgIiwiQmFzaWMgUmVzdG9yYXRpdmUiLCJHcmFmdGluZyIsIlBhdGllbnQgRWR1Y2F0aW9uYWwgU29mdHdhcmUiLCJTcGFjZSBNYWludGFpbmVyIGFuZCBSZW1vdmFsIFRoZXJhcHkiLCJOaXRyb3VzIEVxdWlwbWVudCIsIk9mZmljZSBDb25zdHJ1Y3Rpb24iLCJJbnRlcmRlbnRhbCBQcm9kdWN0cyIsIkFzc29jaWF0aW9ucywgQ29udmVudGlvbnMsIGFuZCBDb25mZXJlbmNlcyIsIkRpc3BlbnNlcnMiLCJEcnkgTW91dGggUmVsaWVmIFByb2R1Y3RzIiwiUGVkaWF0cmljIE1hbmFnZW1lbnQiLCJIaWdoIFNwZWVkIEhhbmRwaWVjZSIsIlByYWN0aWNlIE1hbmFnZW1lbnQiLCJSZXN0b3JhdGl2ZSIsIlByb3N0aG9kb250aWNzIiwiSHlnaWVuaXN0cyIsIlBvbGlzaGluZyBLaXRzIiwiU2NoZWR1bGluZyIsIkRpYWdub3N0aWMgU2VydmljZXMiLCJXaGl0ZW5pbmcgVG9vdGhwYXN0ZXMiLCJEaWdpdGFsIENhbWVyYXMiLCJOaXRyb3VzIiwiTGFyZ2UgR3JvdXAgRGVudGlzdHJ5IiwiQ2xpbmljYWwgSW50cmFvcmFsIFNjYW5uZXJzIiwiRW5kb2RvbnRpY3MiLCJSYWRpb2xvZ3kiLCJCbG9ja3MiLCJTb2Z0d2FyZSBhbmQgVGVjaG5vbG9neSIsIlBheW1lbnQgVGVybWluYWxzIiwiVG9uZ3VlL0NoZWVjayBSZXRyYWN0aW9uIFN5c3RlbXMiLCJBbWFsZ2FtIFNlcGFyYXRvcnMiLCJEZW50YWwgU3Rvb2xzIiwiTGFiIEVxdWlwbWVudCIsIkludHJhbGlnYW1lbnRhbCBTeXJpbmdlcyIsIkxhYiBhbmQgQ0FEL0NBTSBCdXJzIiwiUHJvc3RoZXRpY3MiLCJBY2Nlc3NvcmllcyIsIkxhYiBNYXRlcmlhbHMiLCJGbG91cmlkZSIsIlNvZnQgVGlzc3VlIGFuZCBDTzIgTGFzZXJzIiwiT3J0aG9ncmFkZSIsIkRpc3BlbnNpbmcgR3VucyIsIkZsb3dhYmxlIENvbXBvc2l0ZXMiLCJPcmFsIENhbmNlciBEZXRlY3Rpb24iLCJJbnRyYW9yYWwgSW1hZ2luZyBFcXVpcG1lbnQiLCJYZW5vZ3JhZnQiLCJDb21wbGljYXRpb25zIGFuZCBNYW5hZ2VtZW50IiwiUHJhY3RpY2UgTWFuYWdlbWVudCIsIkludHJhb3JhbCBTZW5zb3JzIiwiRGlhZ25vc3RpYyBJbWFnaW5nIFNvZnR3YXJlIiwiU3VyZ2ljYWwvUHJvc3RoZXRpYyBDb21iaW5lZCIsIkJhcnJpZXIgUHJvdGVjdG9ycyIsIlRvcGljYWxzIiwiSG90IGFuZCBDb2xkIFBhY2tldHMiLCJPcnRob2RvbnRpY3MgSW5zdHJ1bWVudHMiLCJGaWJlciBQb3N0cyIsIlRyYXkgQWRoZXNpdmUgYW5kIENsZWFuZXJzIiwiRmxvdXJpZGUgVmFybmlzaGVzIiwiRGVudGFsIERpb2RlIExhc2VycyIsIlBhbm9yYW1pYy9DZXBoYWxvbWV0cmljIEltYWdpbmcgRXF1aXBtZW50IiwiUGllem9lbGVjdHJpYyBTeXN0ZW1zIiwiTWluaSBJbXBsYW50cyIsIkJpbGxpbmcgYW5kIEluc3VyYW5jZSIsIlN0ZXJpbGl6YXRpb24gTW9uaXRvcnMsIFBvdWNoZXMsIGFuZCBJbmRpY2F0b3JzIiwiTGFiIEJydXNoZXMgYW5kIEJ1ZmZzIiwiRGVzZW5zaXRpemVycyIsIlNlbnNpdGl2ZSBUZWV0aCBUb290aHBhc3RlcyIsIldoaXRlbmluZyBTdXBwbGllcyBhbmQgQWNjZXNzb3JpZXMiLCJOZWVkbGUgTWFudWZhY3R1cmVycyIsIkJpYiBDaGFpbnMiLCJUaXBzLCBCcnVzaGVzLCBhbmQgQXBwbGljYXRvcnMiLCJNYXJrZXRpbmcgKEludGVybmFsL0V4dGVybmFsKSIsIkRlbnRhbCBMYWJvcmF0b3J5IiwiRXZhY3VhdGlvbiBTeXN0ZW0gQ2xlYW5lcnMiLCJCdXNpbmVzcyIsIlJldHJlYXRtZW50IGFuZCBSZXRyb2dyYWRlIiwiRGVudGFsIENoYWlycyIsIkxhYiBQYWNrYWdpbmcgYW5kIERlbGl2ZXJ5IiwiQXV0b2NsYXZlcyBhbmQgSW5zdHJ1bWVudCBQcm9jZXNzaW5nIFN5c3RlbXMiLCJFcXVpcG1lbnQiLCJVbmlmb3JtcyIsIkxvY2FsIEFuZXN0aGV0aWNzIiwiUmluc2VzIiwiQWVzdGhldGljcy9Db3NtZXRpY3MiLCJHZW5lcmFsIFRvb3RocGFzdGVzIiwiVGl0YW5pdW0gSW1wbGFudHMiLCJJbnN1cmFuY2UiLCJEZW50YWwgTEVEIE9wZXJhdGluZyBMaWdodHMiLCJUb25ndWUgU2NyYXBlciIsIkFsbG9ncmFmdCIsIkVuZG9kb250aWMgRXF1aXBtZW50IiwiTWVtYnJhbmVzIGFuZCBUYWNrcyIsIkV4b2RvbnRpYSIsIlByb3N0aG9kb250aWNzL1Jlc3RvcmF0aXZlL0Flc3RoZXRpY3MvQ29zbWV0aWNzIiwiUG9saXNoaW5nIENvbXBvdW5kcyBhbmQgUGFzdGVzIiwiT3JhbCIsIk1lZGljaW5lIiwiTWVkaWNhbCBXYXN0ZSIsIkRpc2luZmVjdGFudCBTcHJheXMsIFNvbHV0aW9ucywgYW5kIFdpcGVzIiwiQWNjb3VudGFudHMiLCJMb3VwZXMgYW5kIE1hZ25pZmljYXRpb24iLCJEZW50YWwgQWlyIEFicmFzaW9uIFVuaXRzIiwiRnVsbCBPZmZpY2UiLCJGdXJuYWNlIFRyYXlzLCBQaWxvd3MsIFN0cmVuZ3RoZW5lcnMsIGFuZCBNZXNoIiwiTWlsbGluZyBNYWNoaW5lcyIsIkhhbmRwaWVjZXMgQ2xlYW5lcnMgYW5kIEx1YnJpY2FudHMiLCJTdXJnaWNhbCBIYW5kcGllY2VzIiwiQWJ1dG1lbnQgYW5kIEFjY2Vzc29yeSBQYXJ0cyIsIkh5Z2llbmUiLCJIYXJkIGFuZCBTb2Z0IFRpc3N1ZSBEZW50YWwgTGFzZXJzIiwiQWlyIENvbXByZXNzb3JzIiwiRGVudGFsIEVxdWlwbWVudCIsIkhlYWx0aCBhbmQgV2VsbGJlaW5nIiwiUm90YXJ5IEZpbGVzIiwiRGVudHVyaXN0cyIsIlByb3BoeSBQYXN0ZXMiLCJSZXBsYWNlbWVudCBQYXJ0cyIsIjNEIFByaW50ZXJzIiwiSW1wcmVzc2lvbiBTeXJpbmdlcyIsIlNsZWVwIEFwcGxpYW5jZXMiLCJFdGNoYW50cyIsIkVmZmljaWVuY3kgYW5kIENvc3QgU2F2aW5ncy9TdXBwbGllcyIsIlJlc3RvcmF0aXZlL0Flc3RoZXRpY3MvQ29zbWV0aWNzIiwiRmxhc2tzLCBQcmVzc2VzLCBhbmQgQ29tcHJlc3NvcnMiLCJDQkNUIEltYWdpbmcgRXF1aXBtZW50IiwiRGVudGFsIENhYmluZXRyeSIsIlRheGVzIGFuZCBMZWdhbCAoVVNBKSIsIkxhYm9yYXRvcmllcyIsIlByb3BoeSBBY2Nlc3NvcmllcyIsIlVsdHJhc29uaWMgYW5kIEVuenltYXRpYyBDbGVhbmluZyBTb2x1dGlvbnMiLCJDb21wb3NpdGVzIiwiTWF0cml4IFN5cmluZ2VzIGFuZCBBY2Nlc3NvcmllcyIsIkJ1cnMgYW5kIEZpbGVzIiwiU3ludGhldGljIEdyYWZ0cyIsIkZpbmFuY2lhbCBQbGFubmVycyIsIk9yYWwgUGF0aG9sb2d5LCBSYWRpb2xvZ3ksIE1lZGljaW5lIiwiUGF0aWVudCBGaW5hbmNpbmciLCJFeHRyYW9yYWwgU3VjdGlvbiBTeXN0ZW1zIiwiQWxpZ25lcnMiLCJIYXphcmRvdXMgV2FzdGUgQmFncyIsIkhvbGlzdGljIFRvb3RocGFzdGVzIiwiQ2FiaW5ldHJ5IiwiT3JhbCBTZWRhdGlvbiIsIkltYWdpbmcgU29mdHdhcmUiLCJEaWdpdGFsIFNlbnNvcnMiLCJDQUQvQ0FNIiwiRGVudGFsIEFtYWxnYW1hdG9ycyIsIlJlc3RvcmF0aXZlIFBpbnMiLCJDb21wbGljYXRpb25zIiwiQWJyYXNpdmVzIiwiRmluYW5jaWFsIFBsYW5uZXJzIiwiTGFiIEluc3RydW1lbnRzIiwiVWx0cmFzb25pYyBTY2FsaW5nIFVuaXRzIGFuZCBBY2Nlc3NvcmllcyIsIkNlcmFtaWMgU3ByYXlzIiwiT3JhbCBTdXJnZXJ5IiwiUGVyaW9kb250YWwgSW5zdHJ1bWVudHMiLCJEaWFnbm9zaXMiLCJEZW50YWwgVmFjdXVtIEZvcm1pbmcgTWFjaGluZXMiLCJNZXRhbCBCcmFja2V0cyIsIkJvbmUgR3JhZnRpbmciLCJEZW50YWwgT2ZmaWNlIFNvZnR3YXJlIiwiQXNzaXN0YW50cyIsIk1peGluZyBBY2Nlc3NvcmllcyIsIkRlbnRhbCBMYXNlcnMiLCJEZW50YWwgU3VwcGxlbWVudHMiLCJTZWFsYW50cyIsIlRyYXlzLCBUdWJzLCBhbmQgUmFja3MiLCJJbnN0cnVtZW50IiwiUGF0aWVudCBFZHVjYXRpb24gVG9vbHMiLCJMYWJvcmF0b3J5IiwiUHJvc3Rob2RvbnRpY3MvT2NjbHVzaW9uIiwiU3BhY2UgTWFpbnRhaW5lcnMvUmVtb3ZhbCIsIlNhbGl2YSBFamVjdG9ycywgRXZhY3VhdGlvbiBUaXBzLCBhbmQgVHJhcHMiLCJMYXd5ZXJzIiwiQnVybmVycyBhbmQgVG9yY2hlcyIsIlN5c3RlbXMgYW5kIEVxdWlwbWVudCIsIlRpc3N1ZSBSZXRyYWN0aW9uIiwiRW1lcmdlbmN5IiwiUGF0aG9sb2d5IiwiU3RhaW5sZXNzIFN0ZWVsIENyb3ducyIsIktleSBCdXNpbmVzcyBJbmRpY2F0b3JzIiwiVGVtcG9yYXJ5IFByb3Zpc2lvbmFsIE1hdGVyaWFscyIsIkluZmVjdGlvbiBDb250cm9sIGFuZCBEaXNwb3NhYmxlcyIsIlBlZGlhdHJpYyBEZW50aXN0cnkiLCJNYXNrcyIsIkhhbmRwaWVjZXMiLCJDaGlsZHJlbidzIFRvb3RocGFzdGUiLCJTb2Z0IFRpc3N1ZSBHcmFmdGluZyIsIlBsYXN0aWMgU3lyaW5nZXMiLCJJbnRlcmNvbSBTb2Z0d2FyZSIsIkZyb250IERlc2siLCJQZWRpYXRyaWMgQ2xpbmljYWwiLCJPZmZpY2UgRGVzaWduIGFuZCBMb2NhdGlvbiIsIkNhc3RpbmciLCJNb25vamVjdCBTeXJpbmdlcyIsIlBlcmlvZG9udGljcyIsIkNvbnN1bHRhbnRzIiwiUGVyaW9kb250aWNzIGFuZCBQcmV2ZW50aXZlIEluc3RydW1lbnRzIiwiV2lyZSBhbmQgQ2xhc3BzIiwiRmlsbSBNb3VudHMgYW5kIEFjY2Vzc29yaWVzIiwiQ2VyYW1pYyBCcmFja2V0cyIsIlBhdGllbnQgTWFuYWdlbWVudCIsIkltcHJlc3Npb24gVHJheXMiLCJNYXRlcmlhbHMvRXF1aXBtZW50IiwiRWxlY3RyaWMgSGFuZHBpZWNlcyIsIk1hdGVyaWFsIiwiQnJva2VyYWdlcyIsIlN1cmdpY2FsIiwiUm9vdCBDYW5hbCBTZWFsZXJzIiwiUGxhc3RpYyBBcHJvbnMgYW5kIFRocm93cyIsIlJ1YmJlciBEYW1zIGFuZCBBY2Nlc3NvcmllcyIsIkdlcmlhdHJpYyBEZW50aXN0cnkiLCJIYW5kIEZpbGVzIiwiVE1EIiwiTGFiIENoZW1pY2FscyIsIkRlbnRhbCBEaWdpdGFsIEVxdWlwbWVudCIsIk1hcmtldGluZyIsIkdsb3ZlcyIsIk1ldGFsIFBvc3RzIiwiTGFtcC9NYWduaWZpZXJzIiwiUGVyaW9kb250YWwgQ2hhcnRpbmciLCJFbmRvZG9udGljIEFjY2Vzc29yaWVzIGFuZCBPcmdhbml6ZXJzIiwiRGVudHVyZSBNYXRlcmlhbHMiLCJWaXRhbHMgYW5kIE94eWdlbiBFbWVyZ2VuY3kgRXF1aXBtZW50IiwiRnVybmFjZXMvT3ZlbnMiLCJTZWRhdGlvbiBFcXVpcG1lbnRzIiwiTGFiIFNwaW5kbGVzLCBDaHVja3MsIGFuZCBNYW5kcmVscyIsIkNlcmFtaWMgSW1wbGFudHMiLCJEZW50YWwgU3BsaW50cyIsIldoaXRlbmluZyBTeXN0ZW1zIiwiQWxsb3kgUmVjbGFpbWluZyIsIkVxdWlwbWVudCBSZXBhaXIiLCJNZWRpY2FtZW50IE1hdGVyaWFscyIsIlRyYWRpdGlvbmFsIEJyYWNrZXRzIiwiQW5lc3RoZXNpYSIsIkZvcmVuc2ljIERlbnRpc3RyeSIsIkxvdyBTcGVlZCBIYW5kcGllY2UiLCJGaXJzdCBBaWQgS2l0cyIsIkNlbWVudHMgYW5kIExpbmVycyIsIkVuZG9kb250aWMgT2J0dXJhdGlvbiBTeXN0ZW1zIiwiSVYvU2VkYXRpb24iLCJGaWxtIERpZ2l0aXplcnMiLCJTdXBwbHkgT3JnYW5pemVycyIsIk9ydGhvZG9udGljcyIsIldhdGVyIFB1cmlmaWNhdGlvbiBTeXN0ZW1zIiwiQ29sZCBTb2FrIFNvbHV0aW9ucyIsIk9wZXJhdG9yeSBFcXVpcG1lbnQiLCJPZmZpY2UgVHJhaW5pbmciLCJEZWZpYnJpbGxhdG9ycyIsIlRheGVzIGFuZCBMZWdhbCAoQ0EpIiwiUmV0cm9ncmFkZS9TdXJnaWNhbCIsIkFwcm9ucywgU2hpZWxkcywgYW5kIEFjY2Vzc29yaWVzIiwiTGFib3JhdG9yeSBJbnRyYW9yYWwgU2Nhbm5lcnMiLCJEZW50YWwgU2hhcnBlbmluZyBNYWNoaW5lcyIsIlByb3RlY3RpdmUgRXlld2VhciIsIklWL0dlbmVyYWwiLCJDb21wcmVzc29yIFN1Y3Rpb24gU3lzdGVtcyIsIkFuZXN0aGVzaWEgU2VkYXRpb24iLCJSZWxpbmUgSmlncyIsIkFjY291bnRzIiwiSHVtYW5pdGFyaWFuIERlbnRpc3RyeSIsIlByb3N0aGV0aWMiLCJEaWFnbm9zaXMgYW5kIFRyZWF0bWVudCBQbGFubmluZyIsIkRlbnRhbCBTdGVyaWxpemF0aW9uIEJheXMgIiwiRW5kb2RvbnRpYyBNZWRpY2FtZW50cyIsIlNvZnQgVGlzc3VlIiwiT3J0aG9kb250aWMgU3VwcGxpZXMiLCJTdXBwbGllcyIsIkZhY2UgU2hpZWxkcyIsIldheGVzIiwiQXJ0aWN1bGF0b3JzIiwiQ3VyaW5nIExpZ2h0cyIsIldhdGVybGluZSIsIlBob3RvZ3JhcGh5IiwiTGVhZGVyc2hpcCIsIkJyYWNrZXRzIiwiUGhhcm1hY2V1dGljYWwiLCJEaXNwb3NhYmxlIFN1bmRyaWVzIiwiVHJlYXRtZW50IENvb3JkaW5hdG9yIiwiUHJvcGh5IEFuZ2xlcyIsIk1hdGVyaWFscyJdLCJpbWFnZSI6IiIsIm9mZmljZV9hZGRyZXNzIjoiVGVzdCBQcmFjdGljZSBhZGRyZXNzIiwib2ZmaWNlX251bWJlciI6IlRlc3QgUHJhY3RpY2UiLCJwaG9uZV9udW1iZXIiOiIrMTIzMjM0NTM1MzQiLCJyb2xlX3R5cGUiOiJWZW5kb3IiLCJ1c2VyX2NpdHkiOiIwMDUyYzhiYi0wYzMxLTRmZWItYjQ3Ni03MWM4MTJhM2VhMTMiLCJ1c2VyX2NvdW50cnkiOiJVbml0ZWQgU3RhdGVzIiwidXNlcl9lbWFpbCI6InYxQHlvcG1haWwuY29tIiwidXNlcl9uYW1lIjoiVmVuZG9yIE9uZSIsInVzZXJfc3RhdGUiOiJHZW9yZ2lhIiwidXNlcl90eXBlX2xpc3QiOlsiTWFudWZhY3R1cmVyIiwiRGlzdHJpYnV0b3IiLCJDb3Vyc2UgUHJvdmlkZXIiLCJMZWN0dXJlci9TcGVha2VyIiwiQ29uc3VsdGFudCJdLCJ1c2VybmFtZSI6IlZlbmRvcjEiLCJ6aXBfY29kZSI6IjIzMjM0In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE2ODg3MzA2MDh9XSwic2Vzc2lvbl9pZCI6ImJjZGVjNGYyLWE2ZjktNDdmZC04NDE5LTRkMDJhNzI5YTNlZCJ9.8xGzb4RezJMqsXgueoWkmzk11IFrk3DFvd0JfJDuqHE"
      const { data, error } = await supabase.auth.api.getUser(aaaaa);

    return res.status(200).send({
      data: data,
    });
  } catch (error) {
    return res.status(200).send({
      message: error?.message,
    });
  }
}
