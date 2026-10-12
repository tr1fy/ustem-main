import Navbar from './Navbar'
import Footer from './Footer'
import SupportPopup from '../../_components/support-popup'
import CookieConsent from '../../_components/cookie-consent'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='site-shell'>
      {/* Focus target for the footer's "Back to top" button. */}
      <span id='page-top' tabIndex={-1} className='visually-hidden' />
      <Navbar />
      {children}
      <Footer />
      <SupportPopup />
      <CookieConsent />
    </div>
  )
}
