import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children, activePage, onNavigate, currentUser = null, onLogout }) {
  return (
    <>
      <Navbar
        activePage={activePage}
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <main>{children}</main>
      <Footer onNavigate={onNavigate} />
    </>
  )
}
