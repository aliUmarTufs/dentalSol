import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function useSupabaseObject({ table, col, val, select = "*" }) {
  const [loading, setLoading] = useState(true);
  const [object, setObject] = useState(null);

  useEffect(() => {
    if (!val) return;

    setLoading(true);

    supabase
      .from(table)
      .select(select)
      .eq(col, val)
      .then(({ data: [obj] }) => {
        setObject(obj);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [table, col, val]);

  return {
    loading,
    object,
  };
}
