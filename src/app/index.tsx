import React, { ComponentRef, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppIntroLoader } from '@/components/common/AppIntroLoader';
import { FinalCtaSection } from '@/components/landing/FinalCtaSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNavbar, LandingSectionId } from '@/components/landing/LandingNavbar';
import { RewardsShowcaseSection } from '@/components/landing/RewardsShowcaseSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { TrustStrip } from '@/components/landing/TrustStrip';
import { WalletTechSection } from '@/components/landing/WalletTechSection';
import { useUserStore } from '@/store/userStore';

export default function LandingScreen() {
  const router = useRouter();
  const loginAsDemo = useUserStore((s) => s.loginAsDemo);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  const [scrolled, setScrolled] = useState(false);
  const sectionPositions = useRef<Record<LandingSectionId, number>>({
    'how-it-works': 680,
    rewards: 1320,
    wallet: 2100,
    security: 2800,
  });

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const nextScrolled = y > 24;
    if (nextScrolled !== scrolled) {
      setScrolled(nextScrolled);
    }
  };

  const scrollToSection = (id: LandingSectionId) => {
    const targetY = Math.max(0, (sectionPositions.current[id] ?? 0) - 72);
    scrollRef.current?.scrollTo({ y: targetY, animated: true });
  };

  const handleGetStarted = () => {
    loginAsDemo();
    router.push('/app/dashboard');
  };

  const handleSignIn = () => {
    router.push('/app/login');
  };

  const handleViewTransactions = () => {
    loginAsDemo();
    router.push('/app/transactions');
  };

  return (
    <View style={styles.root}>
      <LandingNavbar
        scrolled={scrolled}
        onNavigateSection={scrollToSection}
        onSignIn={handleSignIn}
        onGetStarted={handleGetStarted}
      />

      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection
          onExploreRewards={handleGetStarted}
          onDiscoverHowItWorks={() => scrollToSection('how-it-works')}
        />

        <TrustStrip />

        <View
          onLayout={(e) => {
            sectionPositions.current['how-it-works'] = e.nativeEvent.layout.y;
          }}
        >
          <HowItWorksSection />
        </View>

        <View
          onLayout={(e) => {
            sectionPositions.current.rewards = e.nativeEvent.layout.y;
          }}
        >
          <RewardsShowcaseSection
            onOpenDashboard={handleGetStarted}
            onViewTransactions={handleViewTransactions}
          />
        </View>

        <View
          onLayout={(e) => {
            sectionPositions.current.wallet = e.nativeEvent.layout.y;
          }}
        >
          <WalletTechSection />
        </View>

        <View
          onLayout={(e) => {
            sectionPositions.current.security = e.nativeEvent.layout.y;
          }}
        >
          <SecuritySection />
        </View>

        <FinalCtaSection onOpenWalletApp={handleGetStarted} />

        <LandingFooter
          onNavigateSection={scrollToSection}
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
      </ScrollView>

      <AppIntroLoader />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F7F2',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
