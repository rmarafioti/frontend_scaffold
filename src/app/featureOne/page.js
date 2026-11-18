// Scaffold element: a placeholder page, renamed or deleted per site.
import FadeInSection from "@/app/_components/FadeInSection";

export const metadata = {
  title: "Feature One",
  description: "Feature One placeholder description",
};

export default function FeatureOne() {
  return (
    <main>
      <FadeInSection>
        <h1>Feature One</h1>
        <h2>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet
          consectetur adipiscing elit quisque faucibus.
        </h2>
      </FadeInSection>
    </main>
  );
}
