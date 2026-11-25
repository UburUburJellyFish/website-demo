import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BurdenScene } from "@/components/scenes/BurdenScene";
import { ConnectScene } from "@/components/scenes/ConnectScene";
import { CtaScene } from "@/components/scenes/CtaScene";
import { DoseScene } from "@/components/scenes/DoseScene";
import { HistoryScene } from "@/components/scenes/HistoryScene";
import { IntroScene } from "@/components/scenes/IntroScene";
import { LogScene } from "@/components/scenes/LogScene";
import { MeetScene } from "@/components/scenes/MeetScene";
import { ParallaxStory } from "@/components/scenes/ParallaxStory";
import { StagePhone } from "@/components/scenes/StagePhone";
import { TipsScene } from "@/components/scenes/TipsScene";
import { AboutSection } from "@/components/sections/AboutSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { SkipLink } from "@/components/ui/SkipLink";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <SkipLink href="#features">{site.skipLink}</SkipLink>
      <SiteHeader />
      <main className="flex-1">
        <ParallaxStory>
          <IntroScene />
          <BurdenScene />
          <MeetScene />
          <LogScene />
          <TipsScene />
          <DoseScene />
          <HistoryScene />
          <ConnectScene />
          <CtaScene />
          <StagePhone />
        </ParallaxStory>
        <FeatureSection />
        <AboutSection />
      </main>
      <SiteFooter />
    </>
  );
}
