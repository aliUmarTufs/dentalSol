import { Markup } from "interweave";
import Link from "next/link";
import { Footer, HeadMeta, Navbar, PageTitleInfo } from "../../components";
import { BASE_URL, ROUTES } from "../../constants";

export default function TermsAndConditions({ contentData }) {
  return (
    <>
      <HeadMeta
        title={"Dent247 | Terms And Conditions"}
        description="description"
        content={"Dent247 | Terms And Conditions"}
      />
      <Navbar isPageTitleInfo={true} />

      <PageTitleInfo title={"terms of service"} />
      <div className="bg-light-blue">
        <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-8 lg:pt-16 pb-8 md:pb-12 lg:pb-20">
          <Markup content={contentData?.data?.content} className="terms_page" />
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${BASE_URL}/api/content?type=terms_of_service`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { contentData: data } };
}
