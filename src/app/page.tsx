import { CareerEvidenceSection } from '@/features/career-evidence/career-evidence-section'
import { ContactSection } from '@/features/contact/contact-section'
import { HeroSection } from '@/features/hero/hero-section'
import { LeadershipSection } from '@/features/leadership/leadership-section'
import { PersonalProjectsSection } from '@/features/personal-projects/personal-projects-section'

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />
      <CareerEvidenceSection />
      <LeadershipSection />
      <PersonalProjectsSection />
      <ContactSection />
    </main>
  )
}
