import { supabase } from "../../lib/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "../../components";
import { ROUTES } from "../../constants";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [loginRequired, setLoginRequired] = useState(false);
  const [profile, setProfile] = useState([]);

  const fetchUser = async () => {
    const user = supabase.auth.user();

    if (user) {
      setUser(user);
      setLoading(false);

      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id);

      setProfile(data[0]);
    } else {
      setUser(null);
      setLoginRequired(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    if (loginRequired) {
      return (
        <div>
          You need to log in to access this page. Login{" "}
          <Link href={`${ROUTES.LOGIN}`}>
            <a className="text-blue-600">here</a>
          </Link>
          .
        </div>
      );
    } else {
      return (
        <div>
          <Navbar />
          Billing, @{profile.username}
        </div>
      );
    }
  }
}

export async function getStaticProps() {
  return {
    props: {
      isProtected: true,
    },
  };
}
