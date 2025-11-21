import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PopularCourses } from "@/components/PopularCourses";
import { AboutSection } from "@/components/AboutSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { Newsletter } from "@/components/Newsletter";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { CallToAction } from "@/components/CallToAction";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { fetchLandingContent } from "@/lib/landing-data";

export const revalidate = 0;

export default async function Page() {
  const { content } = await fetchLandingContent();

  return (
    <>
      <Navbar />
      <main className="space-y-6 pb-10">
        <Hero content={content.hero} />
        <PopularCourses content={content.popularCourses} />
        <AboutSection content={content.about} />
        <WhyChooseSection content={content.whyChoose} />
        <Newsletter content={content.newsletter} />
        <Testimonials content={content.testimonials} />
        <CallToAction content={content.cta} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
