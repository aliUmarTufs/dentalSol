import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const getData = req.query;

    let getOrganizationsOfUsers;
    if (getData?.entity_type && getData?.user_id) {
      let itemDetails;
      let itemDetailCount;
      let orgMap;
      let subscriptionEntity = 1;

      let getUserDetail = await supabase
        .from("users")
        .select("* ,user_city(*), subscription_id(*) , plan_id(*) ")
        .eq("id", getData?.user_id);
      if (getUserDetail?.data && getUserDetail?.data?.length > 0) {
        if (getUserDetail?.data[0]?.subscription_id?.subscription_entry) {
          subscriptionEntity =
            getUserDetail?.data[0]?.subscription_id?.subscription_entry;
        }
        switch (getData?.entity_type) {
          case "courses":
            getOrganizationsOfUsers = await supabase
              .from("organizations")
              .select("*")
              .eq("organization_type", "course_provider")
              .eq("organization_user", getData?.user_id);

            if (
              getOrganizationsOfUsers?.data &&
              getOrganizationsOfUsers?.data?.length > 0
            ) {
              orgMap = _.map(getOrganizationsOfUsers?.data, "id");
            }
            if (orgMap?.length > 0) {
              itemDetails = await supabase
                .from("courses")
                .select("*")
                .in("organization", orgMap)
                .order("created_at", { ascending: true })
                .range(
                  parseInt(getData?.offset) == 0
                    ? 0
                    : parseInt(getData?.offset),
                  parseInt(getData?.offset) == 0
                    ? 4
                    : parseInt(getData?.offset) + 5
                );
              itemDetailCount = await supabase
                .from("courses")
                .select("*")
                .in("organization", orgMap)
                .order("created_at", { ascending: true });
            } else {
              itemDetails = [];
            }

            break;
          case "products":
            getOrganizationsOfUsers = await supabase
              .from("organizations")
              .select("*")
              .eq("organization_type", "product_provider")
              .eq("organization_user", getData?.user_id);
            if (
              getOrganizationsOfUsers?.data &&
              getOrganizationsOfUsers?.data?.length > 0
            ) {
              orgMap = _.map(getOrganizationsOfUsers?.data, "id");
            }
            if (orgMap?.length > 0) {
              itemDetails = await supabase
                .from("products")
                .select("*")
                .in("organization", orgMap)
                .order("created_at", { ascending: true })
                .range(
                  parseInt(getData?.offset) == 0
                    ? 0
                    : parseInt(getData?.offset),
                  parseInt(getData?.offset) == 0
                    ? 4
                    : parseInt(getData?.offset) + 5
                );
              itemDetailCount = await supabase
                .from("products")
                .select("*")
                .in("organization", orgMap)
                .order("created_at", { ascending: true });
            } else {
              itemDetails = [];
            }

            break;
          case "services":
            getOrganizationsOfUsers = await supabase
              .from("organizations")
              .select("*")
              .eq("organization_type", "service_provider")
              .eq("organization_user", getData?.user_id);
            if (
              getOrganizationsOfUsers?.data &&
              getOrganizationsOfUsers?.data?.length > 0
            ) {
              orgMap = _.map(getOrganizationsOfUsers?.data, "id");
            }
            if (orgMap?.length > 0) {
              itemDetails = await supabase
                .from("directory_companies")
                .select("*")
                .in("company", orgMap)
                .order("created_at", { ascending: true })
                .range(
                  parseInt(getData?.offset) == 0
                    ? 0
                    : parseInt(getData?.offset),
                  parseInt(getData?.offset) == 0
                    ? 4
                    : parseInt(getData?.offset) + 5
                );
              itemDetailCount = await supabase
                .from("directory_companies")
                .select("*")
                .in("company", orgMap)
                .order("created_at", { ascending: true });
            } else {
              itemDetails = [];
            }

            break;
          case "articles":
            itemDetails = await supabase
              .from("articles")
              .select("*")
              .eq("user_id", getData?.user_id)
              .order("time_published", { ascending: true })
              .range(
                parseInt(getData?.offset) == 0
                  ? 0
                  : parseInt(getData?.offset),
                parseInt(getData?.offset) == 0
                  ? 4
                  : parseInt(getData?.offset) + 5
              );
            itemDetailCount = await supabase
              .from("articles")
              .select("*")
              .eq("user_id", getData?.user_id)
              .order("time_published", { ascending: true });
            break;

          default:
            break;
        }
        if (itemDetails && itemDetails?.data) {
          let blockedItemIds = [];
          let notBlockedItems = [];
          let updateItems;
          let updateBlockedItems;
          let featuredIds = _.map(itemDetails?.data, "id");
          if (featuredIds?.length > 0) {
            let featuredItemList = await supabase
              .from("featured_slots_avail")
              .select("* , slot_id(*)")
              .in("item_id", featuredIds)
              .eq("is_expire", 0);

            let counter = parseInt(getData?.offset);
            itemDetails?.data?.map((e, index) => {
              index = index + 1;
              if (counter + index > subscriptionEntity) {
                e.blocked_item = true;
                e.is_blocked = 1;
                blockedItemIds.push(e?.id);
              } else {
                e.blocked_item = false;
                e.is_blocked = 0;
                notBlockedItems.push(e?.id);
              }
              if (featuredItemList?.data?.length > 0) {
                let featuredItemListing = _.filter(
                  featuredItemList?.data,
                  (i) => {
                    return e?.id == i?.item_id;
                  }
                );
                if (featuredItemListing && featuredItemListing?.length > 0) {
                  e.featured_item = true;
                } else {
                  e.featured_item = false;
                }
              }
              // console.log(counter + index, counter + index > subscriptionEntity ,counter, index);
            });
          }
          if (blockedItemIds && blockedItemIds?.length > 0) {
            switch (getData?.entity_type) {
              case "courses":
                updateItems = await supabase
                  .from("courses")
                  .update({ is_blocked: 1 })
                  .in("id", blockedItemIds);
                updateBlockedItems = await supabase
                  .from("courses")
                  .update({ is_blocked: 0 })
                  .in("id", notBlockedItems);
                break;
              case "products":
                updateItems = await supabase
                  .from("products")
                  .update({ is_blocked: 1 })
                  .in("id", blockedItemIds);

                updateBlockedItems = await supabase
                  .from("products")
                  .update({ is_blocked: 0 })
                  .in("id", notBlockedItems);

                break;
              case "services":
                updateItems = await supabase
                  .from("courses")
                  .update({ is_blocked: 1 })
                  .in("id", blockedItemIds);

                updateBlockedItems = await supabase
                  .from("courses")
                  .update({ is_blocked: 0 })
                  .in("id", notBlockedItems);

                break;
              case "articles":
                updateItems = await supabase
                  .from("articles")
                  .update({ is_blocked: 1 })
                  .in("id", blockedItemIds);

                updateBlockedItems = await supabase
                  .from("articles")
                  .update({ is_blocked: 0 })
                  .in("id", notBlockedItems);

                break;
              default:
                break;
            }
          }

          if (notBlockedItems && notBlockedItems?.length > 0) {
            switch (getData?.entity_type) {
              case "courses":
                updateBlockedItems = await supabase
                  .from("courses")
                  .update({ is_blocked: 0 })
                  .in("id", notBlockedItems);
                break;
              case "products":
                updateBlockedItems = await supabase
                  .from("products")
                  .update({ is_blocked: 0 })
                  .in("id", notBlockedItems);

                break;
              case "services":
                updateBlockedItems = await supabase
                  .from("courses")
                  .update({ is_blocked: 0 })
                  .in("id", notBlockedItems);

                break;
              case "articles":
                updateBlockedItems = await supabase
                  .from("articles")
                  .update({ is_blocked: 0 })
                  .in("id", notBlockedItems);

                break;
              default:
                break;
            }
          }
          res.status(200).send({
            status: true,
            message: "Data Found",
            data: itemDetails?.data,
            key: getData?.entity_type,
            totalCount:
              itemDetailCount?.data?.length > 0
                ? itemDetailCount?.data?.length
                : 0,
            offset: parseInt(getData?.offset) + 5,
            length: itemDetails?.data?.length,
          });
        } else {
          res.status(400).send({
            status: false,
            message: "Error Occured",
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: "User not found",
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Type required",
      });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}
