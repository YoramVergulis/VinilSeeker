import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import SearchPage from './pages/SearchPage'
import ProductPage from './pages/ProductPage'
import UploadPage from './pages/UploadPage'
import ProfilePage from './pages/ProfilePage'
import CategoriesPage from './pages/CategoriesPage'
import StoresPage from './pages/StoresPage'
import SavedPage from './pages/SavedPage'
import ChatPage from './pages/ChatPage'
import AdminPage from './pages/AdminPage'
import RarePage from './pages/RarePage'
import HowPage from './pages/HowPage'
import SellerGuidePage from './pages/SellerGuidePage'
import PricingPage from './pages/PricingPage'
import BlogPage from './pages/BlogPage'
import ContactPage from './pages/ContactPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import { ALL_VINYL } from './data/vinyl'
import { supabase } from './supabase'
import { formatUser, logout, updateUser, getListings, addListing, updateListing, checkIsAdmin } from './auth'

export default function App() {
  const [page,            setPage]            = useState('home')
  const [searchQuery,     setSearchQuery]     = useState('')
  const [searchGenre,     setSearchGenre]     = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [vinylList,       setVinylList]       = useState([...ALL_VINYL])
  const [currentUser,     setCurrentUser]     = useState(null)
  const [editTarget,      setEditTarget]      = useState(null)
  const [chatConvId,      setChatConvId]      = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(formatUser(session?.user ?? null))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(formatUser(session?.user ?? null))
    })
    getListings().then(stored => {
      if (stored.length > 0) setVinylList([...stored, ...ALL_VINYL])
    })
    return () => subscription.unsubscribe()
  }, [])

  async function addVinyl(record) {
    try {
      const saved = await addListing(record)
      setVinylList(prev => [saved, ...prev])
    } catch (err) {
      console.error('addListing error:', err)
      setVinylList(prev => [record, ...prev])
    }
  }

  async function editVinyl(id, updates) {
    try {
      await updateListing(id, updates)
      setVinylList(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
    } catch (err) {
      console.error('updateListing error:', err)
    }
  }

  function handleLogin(user) {
    setCurrentUser(user)
    setPage('home')
    window.scrollTo(0, 0)
  }

  async function handleLogout() {
    await logout()
    setCurrentUser(null)
    setPage('home')
    window.scrollTo(0, 0)
  }

  async function handleUpdateUser(updates) {
    const updated = await updateUser(updates)
    if (updated) setCurrentUser(updated)
  }

  function navigate(pageName, opts = {}) {
    if (!currentUser && (pageName === 'upload' || pageName === 'profile' || pageName === 'edit' || pageName === 'saved' || pageName === 'chat')) {
      setPage('auth')
      window.scrollTo(0, 0)
      return
    }
    if (pageName === 'admin' && !checkIsAdmin(currentUser)) {
      setPage('home')
      window.scrollTo(0, 0)
      return
    }
    if (opts.query   !== undefined) setSearchQuery(opts.query)
    if (opts.genre   !== undefined) setSearchGenre(opts.genre)
    if (opts.product !== undefined) setSelectedProduct(opts.product)
    if (opts.listing !== undefined) setEditTarget(opts.listing)
    if (opts.convId  !== undefined) setChatConvId(opts.convId)
    setPage(pageName)
    window.scrollTo(0, 0)
    if (opts.scrollTo) {
      setTimeout(() => document.getElementById(opts.scrollTo)?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }

  const shared = { currentUser, onLogout: handleLogout, onNavigate: navigate }

  if (page === 'auth') {
    return <AuthPage onNavigate={navigate} onLogin={handleLogin} />
  }

  if (page === 'categories') {
    return <CategoriesPage {...shared} vinylList={vinylList} />
  }

  if (page === 'stores') {
    return <StoresPage {...shared} />
  }

  if (page === 'saved') {
    return <SavedPage {...shared} vinylList={vinylList} />
  }

  if (page === 'chat') {
    return <ChatPage {...shared} initialConvId={chatConvId} />
  }

  if (page === 'admin') {
    return <AdminPage {...shared} vinylList={vinylList} />
  }

  if (page === 'rare') {
    return <RarePage {...shared} vinylList={vinylList} />
  }

  if (page === 'how') {
    return <HowPage {...shared} />
  }

  if (page === 'seller') {
    return <SellerGuidePage {...shared} />
  }

  if (page === 'pricing') {
    return <PricingPage {...shared} />
  }

  if (page === 'blog') {
    return <BlogPage {...shared} />
  }

  if (page === 'contact') {
    return <ContactPage {...shared} />
  }

  if (page === 'terms') {
    return <TermsPage {...shared} />
  }

  if (page === 'privacy') {
    return <PrivacyPage {...shared} />
  }

  if (page === 'search') {
    return <SearchPage {...shared} query={searchQuery} initialGenre={searchGenre} vinylList={vinylList} />
  }

  if (page === 'product') {
    return <ProductPage {...shared} product={selectedProduct} vinylList={vinylList} />
  }

  if (page === 'upload') {
    return <UploadPage {...shared} onAddVinyl={addVinyl} />
  }

  if (page === 'edit') {
    return <UploadPage {...shared} onAddVinyl={addVinyl} initialListing={editTarget} onEditVinyl={editVinyl} />
  }

  if (page === 'profile') {
    return <ProfilePage {...shared} vinylList={vinylList} onUpdateUser={handleUpdateUser} />
  }

  return (
    <Layout activePage="בית" {...shared}>
      <LandingPage onNavigate={navigate} />
    </Layout>
  )
}
