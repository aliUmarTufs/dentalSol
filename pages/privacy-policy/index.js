import {
	LocationMarkerIcon,
	MailIcon,
	PhoneIcon,
	UserIcon,
} from "@heroicons/react/solid";
import { Markup } from "interweave";
import Link from "next/link";
import { Footer, HeadMeta, Navbar, PageTitleInfo } from "../../components";
import { BASE_URL } from "../../constants";

export default function PrivacyPolicy({ contentData }) {
	return (
		<>
			<HeadMeta
				title={"Dent247 | Privacy Policy"}
				description="description"
				content={"Dent247 | Privacy Policy"}
			/>
			<Navbar isPageTitleInfo={true} />

			<PageTitleInfo title={"privacy policy"} />
			<div className="bg-light-blue">
				<div className="max-w-7xl mx-auto px-4 lg:px-2 pt-8 lg:pt-16 pb-8 md:pb-12 lg:pb-20">
					<Markup
						content={contentData?.data?.content}
						className="privacy_page"
					/>
					{/* <p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						<Link href={`${BASE_URL}`}>
							<span className="cursor-pointer text-blue-600 font-medium hover:underline">
								dent247.com
							</span>
						</Link>{" "}
						(the "Site") is owned and operated by Dent247 Inc. Dent247 Inc is
						the data controller and can be contacted at:
					</p>
					<ul>
						<div className="flex items-center gap-2">
							<MailIcon className="w-6 h-6" />
							<Link href={"mailto:info@dent247.com"}>
								<li className="cursor-pointer my-2 text-blue-600 font-medium hover:underline">
									info@dent247.com
								</li>
							</Link>
						</div>
						<div className="flex items-center gap-2">
							<PhoneIcon className="w-6 h-6" />
							<Link href={"tel:+18448003368"}>
								<li className="cursor-pointer my-2 text-blue-600 font-medium hover:underline">
									+1 844-800-3368
								</li>
							</Link>
						</div>
						<div className="flex items-center gap-2">
							<LocationMarkerIcon className="w-6 h-6" />
							<Link
								href={
									"https://www.google.com/maps/place/43+Matson+Dr,+Bolton,+ON+L7E+0A9,+Canada/@43.9478453,-79.7908461,17z/data=!3m1!4b1!4m5!3m4!1s0x882ae1d3967d3e1d:0xb3a2fd6d3a85b29c!8m2!3d43.9478453!4d-79.7886574"
								}>
								<li className="cursor-pointer my-2 text-blue-600 font-medium hover:underline">
									Matson Dr, Bolton ON, L7E 0A9
								</li>
							</Link>
						</div>
					</ul>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Purpose
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						The purpose of this privacy policy (this "Privacy Policy") is to
						inform users of our Site of the following:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							The personal data we will collect;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Use of collected data;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Who has access to the data collected;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							The rights of Site users; and
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							The Site's cookie policy.
						</li>
					</ol>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						This Privacy Policy applies in addition to the terms and conditions
						of our Site.
					</p>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						GDPR
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						For users in the European Union, we adhere to the Regulation (EU)
						2016/679 of the European Parliament and of the Council of 27 April
						2016, known as the General Data Protection Regulation (the "GDPR").
						For users in the United Kingdom, we adhere to the GDPR as enshrined
						in the Data Protection Act 2018.
					</p>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We have not appointed a Data Protection Officer as we do not fall
						within the categories of controllers and processors required to
						appoint a Data Protection Officer under Article 37 of the GDPR.
					</p>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Consent
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						By using our Site users agree that they consent to:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							The conditions set out in this Privacy Policy.
						</li>
					</ol>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						When the legal basis for us processing your personal data is that
						you have provided your consent to that processing, you may withdraw
						your consent at any time. If you withdraw your consent, it will not
						make processing which we completed before you withdrew your consent
						unlawful.
					</p>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						You can withdraw your consent by: Contact Data Protection Officer.
					</p>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Legal Basis for Processing
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We collect and process personal data about users in the EU only when
						we have a legal basis for doing so under Article 6 of the GDPR.
					</p>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We rely on the following legal basis to collect and process the
						personal data of users in the EU:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Users have provided their consent to the processing of their data
							for one or more specific purposes.
						</li>
					</ol>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Personal Data We Collect
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We only collect data that helps us achieve the purpose set out in
						this Privacy Policy. We will not collect any additional data beyond
						the data listed below without notifying you first.
					</p>
					<h3 className="mt-2 mb-6 text-xl text-gray-900 font-normal capitalize">
						Data Collected Automatically
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						When you visit and use our Site, we may automatically collect and
						store the following information:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							IP address;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Location;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Hardware and software details;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Clicked links; and
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Content viewed.
						</li>
					</ol>
					<h3 className="my-6 text-xl text-gray-900 font-normal capitalize">
						Data Collected in a Non-Automatic Way
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We may also collect the following data when you perform certain
						functions on our Site:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							First and last name;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Age;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Date of birth;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Sex;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Email address;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Phone number;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Address; and
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Auto fill data.
						</li>
					</ol>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						This data may be collected using the following methods:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Creating an account.
						</li>
					</ol>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						How We Use Personal Data
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						Data collected on our Site will only be used for the purposes
						specified in this Privacy Policy or indicated on the relevant pages
						of our Site. We will not use your data beyond what we disclose in
						this Privacy Policy.
					</p>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						The data we collect automatically is used for the following
						purposes:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							To improve the user experience.
						</li>
					</ol>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						The data we collect when the user performs certain functions may be
						used for the following purposes:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Communication.
						</li>
					</ol>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Who We Share Personal Data With{" "}
					</h3>
					<h3 className="mt-2 mb-6 text-xl text-gray-900 font-normal capitalize">
						Employees
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We may disclose user data to any member of our organization who
						reasonably needs access to user data to achieve the purposes set out
						in this Privacy Policy.
					</p>
					<h3 className="mt-2 mb-6 text-xl text-gray-900 font-normal capitalize">
						Third Parties
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We may share user data with the following third parties:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Marketing Agency.
						</li>
					</ol>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We may share the following user data with third parties:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Information requests.
						</li>
					</ol>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We may share user data with third parties for the following
						purposes:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Targeted advertising.
						</li>
					</ol>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						Third parties will not be able to access user data beyond what is
						reasonably necessary to achieve the given purpose.
					</p>
					<h3 className="mt-2 mb-6 text-xl text-gray-900 font-normal capitalize">
						Other Disclosures
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We will not sell or share your data with other third parties, except
						in the following cases:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							If the law requires it;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							If it is required for any legal proceeding;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							To prove or protect our legal rights; and
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							To buyers or potential buyers of this company in the event that we
							seek to sell the company.
						</li>
					</ol>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						If you follow hyperlinks from our Site to another Site, please note
						that we are not responsible for and have no control over their
						privacy policies and practices.
					</p>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						How Long We Store Personal Data
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						User data will be stored until the purpose the data was collected
						for has been achieved.
					</p>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						You will be notified if your data is kept for longer than this
						period.
					</p>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						How We Protect Your Personal Data
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						In order to protect your security, we use the strongest available
						browser encryption and store all of our data on servers in secure
						facilities. All data is only accessible to our employees. Our
						employees are bound by strict confidentiality agreements and a
						breach of this agreement would result in the employee's termination.
						While we take all reasonable precautions to ensure that user data is
						secure and that users are protected, there always remains the risk
						of harm. The Internet as a whole can be insecure at times and
						therefore we are unable to guarantee the security of user data
						beyond what is reasonably practical.
					</p>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Your Rights as a User
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						Under the GDPR, you have the following rights:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Right to be informed;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Right of access;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Right to rectification;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Right to erasure;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Right to restrict processing;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Right to data portability; and
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							Right to object.
						</li>
					</ol>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Children
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						The minimum age to use our website is 18 years of age. We do not
						knowingly collect or use personal data from children under 16 years
						of age. If we learn that we have collected personal data from a
						child under 16 years of age, the personal data will be deleted as
						soon as possible. If a child under 16 years of age has provided us
						with personal data their parent or guardian may contact our privacy
						officer.
					</p>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						How to Access, Modify, Delete, or Challenge the Data Collected
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						If you would like to know if we have collected your personal data,
						how we have used your personal data, if we have disclosed your
						personal data and to who we disclosed your personal data, if you
						would like your data to be deleted or modified in any way, or if you
						would like to exercise any of your other rights under the GDPR,
						please contact our privacy officer here:
					</p>
					<ul>
						<div className="flex items-center gap-2">
							<UserIcon className="w-6 h-6" />
							<li className="my-2 text-blue-600 font-medium">Cameroon</li>
						</div>
						<div className="flex items-center gap-2">
							<MailIcon className="w-6 h-6" />
							<Link href={"mailto:info@dent247.com"}>
								<li className="cursor-pointer my-2 text-blue-600 font-medium hover:underline">
									info@dent247.com
								</li>
							</Link>
						</div>
						<div className="flex items-center gap-2">
							<PhoneIcon className="w-6 h-6" />
							<Link href={"tel:+18448003368"}>
								<li className="cursor-pointer my-2 text-blue-600 font-medium hover:underline">
									+1 844-800-3368
								</li>
							</Link>
						</div>
						<div className="flex items-center gap-2">
							<LocationMarkerIcon className="w-6 h-6" />
							<Link
								href={
									"https://www.google.com/maps/place/43+Matson+Dr,+Bolton,+ON+L7E+0A9,+Canada/@43.9478453,-79.7908461,17z/data=!3m1!4b1!4m5!3m4!1s0x882ae1d3967d3e1d:0xb3a2fd6d3a85b29c!8m2!3d43.9478453!4d-79.7886574"
								}>
								<li className="cursor-pointer my-2 text-blue-600 font-medium hover:underline">
									Matson Dr, Bolton ON, L7E 0A9
								</li>
							</Link>
						</div>
					</ul>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Do Not Track Notice
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						Do Not Track ("DNT") is a privacy preference that you can set in
						certain web browsers. We respond to browser-initiated DNT signals.
						If we receive a DNT signal that indicates a user does not wish to be
						tracked, we will not track that user. We are not responsible for and
						cannot guarantee how any third parties who interact with our Site
						and your data will respond to DNT signals.
					</p>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Cookie Policy
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						A cookie is a small file, stored on a user's hard drive by a
						website. Its purpose is to collect data relating to the user's
						browsing habits. You can choose to be notified each time a cookie is
						transmitted. You can also choose to disable cookies entirely in your
						internet browser, but this may decrease the quality of your user
						experience.
					</p>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						We use the following types of cookies on our Site:
					</p>
					<ol className="list-decimal px-4">
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							<h3 className="my-2 text-gray-600 font-normal capitalize">
								Functional cookies
							</h3>
							Functional cookies are used to remember the selections you make on
							our Site so that your selections are saved for your next visits;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							<h3 className="my-2 text-gray-600 font-normal capitalize">
								Analytical cookies
							</h3>
							Analytical cookies allow us to improve the design and
							functionality of our Site by collecting data on how you access our
							Site, for example data on the content you access, how long you
							stay on our Site, etc;
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							<h3 className="my-2 text-gray-600 font-normal capitalize">
								Targeting cookies
							</h3>
							Targeting cookies collect data on how you use the Site and your
							preferences. This allows us to personalize the information you see
							on our Site for you; and
						</li>
						<li className="my-2 font-normal text-gray-600 text-base leading-normal">
							<h3 className="my-2 text-gray-600 font-normal capitalize">
								Third-Party Cookies
							</h3>
							Third-party cookies are created by a website other than ours. We
							may use third-party cookies to achieve the following purposes:
						</li>
						<ul className="list-alphabets px-16">
							<li className="my-2 font-normal text-gray-600 text-base leading-normal">
								Monitor user preferences to tailor advertisements around their
								interests.
							</li>
						</ul>
					</ol>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Modifications
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						This Privacy Policy may be amended from time to time in order to
						maintain compliance with the law and to reflect any changes to our
						data collection process. When we amend this Privacy Policy we will
						update the "Effective Date" at the top of this Privacy Policy. We
						recommend that our users periodically review our Privacy Policy to
						ensure that they are notified of any updates. If necessary, we may
						notify users by email of changes to this Privacy Policy.
					</p>
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Complaints
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						If you have any complaints about how we process your personal data,
						please contact us through the contact methods listed in the Contact
						Information section so that we can, where possible, resolve the
						issue. If you feel we have not addressed your concern in a
						satisfactory manner you may contact a supervisory authority. You
						also have the right to directly make a complaint to a supervisory
						authority. You can lodge a complaint with a supervisory authority by
						contacting the
					</p>
					<hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />
					<h3 className="my-6 text-xl md:text-2xl text-gray-900 font-medium uppercase">
						Contact Information
					</h3>
					<p className="my-6 font-normal text-gray-600 text-justify text-base leading-normal">
						If you have any questions, concerns or complaints, you can contact
						our privacy officer, Cameron, at:
					</p>
					<ul>
						<div className="flex items-center gap-2">
							<MailIcon className="w-6 h-6" />
							<Link href={"mailto:info@dent247.com"}>
								<li className="cursor-pointer my-2 text-blue-600 font-medium hover:underline">
									info@dent247.com
								</li>
							</Link>
						</div>
						<div className="flex items-center gap-2">
							<PhoneIcon className="w-6 h-6" />
							<Link href={"tel:+18448003368"}>
								<li className="cursor-pointer my-2 text-blue-600 font-medium hover:underline">
									+1 844-800-3368
								</li>
							</Link>
						</div>
						<div className="flex items-center gap-2">
							<LocationMarkerIcon className="w-6 h-6" />
							<Link
								href={
									"https://www.google.com/maps/place/43+Matson+Dr,+Bolton,+ON+L7E+0A9,+Canada/@43.9478453,-79.7908461,17z/data=!3m1!4b1!4m5!3m4!1s0x882ae1d3967d3e1d:0xb3a2fd6d3a85b29c!8m2!3d43.9478453!4d-79.7886574"
								}>
								<li className="cursor-pointer my-2 text-blue-600 font-medium hover:underline">
									Matson Dr, Bolton ON, L7E 0A9
								</li>
							</Link>
						</div>
					</ul> */}
				</div>
			</div>
			<Footer />
		</>
	);
}

export async function getServerSideProps() {
	// Fetch data from external API
	const res = await fetch(`${BASE_URL}/api/content?type=privacy_policy`);
	const data = await res.json();

	// Pass data to the page via props
	return { props: { contentData: data } };
}
