import { Markup } from "interweave";
import { Navbar, Footer, HeadMeta, PageTitleInfo } from "../../components";
import { BASE_URL } from "../../constants";

export default function About({ contentData }) {
  return (
    <>
      <HeadMeta
        title={"Dent247 | About"}
        description="description"
        content={"Dent247 | About"}
      />
      <Navbar isPageTitleInfo={true} />

      <PageTitleInfo title="About" />
      <div className="bg-light-blue">
        <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-8 lg:pt-16 pb-8 md:pb-12 lg:pb-20">
			<Markup content={contentData?.data?.content} className={"content_pages"}/>
		</div>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${BASE_URL}/api/content?type=about`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { contentData: data } };
}
