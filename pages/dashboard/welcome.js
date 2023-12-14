export default function Welcome() {
  return <div>Welcome to dent247. Let&apos;s get your account set up.</div>;
}
export async function getStaticProps() {
  return {
    props: {
      isProtected: true,
    },
  };
}
