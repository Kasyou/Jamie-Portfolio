import HeroSection from '../components/home/HeroSection';
import CapabilitiesSection from '../components/home/CapabilitiesSection';
import TechSpectrumSection from '../components/home/TechSpectrumSection';
import FeaturedWorkSection from '../components/home/FeaturedWorkSection';
import WhyMeSection from '../components/home/WhyMeSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CapabilitiesSection />
      <TechSpectrumSection />
      <FeaturedWorkSection />
      <WhyMeSection />
    </>
  );
}
