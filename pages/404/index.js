import { HeadMeta, Navbar, NotFound } from "../../components";
export default function PageNotFound() {
	return (
		<>
			<HeadMeta
				title={"Dent247 | 404 Not Found"}
				description="description"
				content={"Dent247 | 404 Not Found"}
			/>
			<Navbar  />
			<div className="bg-white">
				<div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 mt-44">
					<NotFound
						isItem={false}
						title={"This page could not be found."}
						heroImage={"/404-page.png"}
					/>
				</div>
			</div>
		</>
	);
}
