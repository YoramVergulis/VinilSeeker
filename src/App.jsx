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
import { supabase } from './supabase'
import { formatUser, logout, updateUser, getListings, getStoreInventory, addListing, updateListing, deleteListing, checkIsAdmin } from './auth'
import { lookupDiscogs } from './discogs'

// Page name → URL path mapping
const PAGE_PATHS = {
  home: '/', search: '/search', product: '/product', upload: '/upload',
  edit: '/edit', auth: '/auth', profile: '/profile', saved: '/saved',
  chat: '/chat', admin: '/admin', categories: '/categories', stores: '/stores',
  rare: '/rare', how: '/how', seller: '/seller', pricing: '/pricing',
  blog: '/blog', contact: '/contact', terms: '/terms', privacy: '/privacy',
}
const PATH_PAGES = Object.fromEntries(Object.entries(PAGE_PATHS).map(([k, v]) => [v, k]))

export default function App() {
  // On refresh: history.state survives and contains full state.
  // On direct link: parse the URL path to determine the initial page.
  const [page, setPage] = useState(() =>
    history.state?.page || PATH_PAGES[window.location.pathname] || 'home'
  )
  const [searchQuery,     setSearchQuery]     = useState(() => history.state?.searchQuery     || '')
  const [searchGenre,     setSearchGenre]     = useState(() => history.state?.searchGenre     || '')
  const [selectedProduct, setSelectedProduct] = useState(() => history.state?.selectedProduct || null)
  const [vinylList,       setVinylList]       = useState([])
  const [currentUser,     setCurrentUser]     = useState(null)
  const [editTarget,      setEditTarget]      = useState(() => history.state?.editTarget      || null)
  const [chatContext,     setChatContext]      = useState(() => history.state?.chatContext     || null)

  async function loadUser(supabaseUser) {
    if (!supabaseUser) return null
    const base = formatUser(supabaseUser)
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', supabaseUser.id)
      .maybeSingle()
    return { ...base, isAdmin: profile?.is_admin === true }
  }

  useEffect(() => {
    // Stamp the initial history entry so popstate always has state to restore
    if (!history.state) {
      history.replaceState(
        { page, searchQuery, searchGenre, selectedProduct, chatContext, editTarget },
        '',
        window.location.pathname
      )
    }

    function handlePopState(e) {
      if (!e.state) return
      const s = e.state
      setPage(s.page || 'home')
      setSearchQuery(s.searchQuery || '')
      setSearchGenre(s.searchGenre || '')
      setSelectedProduct(s.selectedProduct || null)
      setChatContext(s.chatContext || null)
      setEditTarget(s.editTarget || null)
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', handlePopState)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setCurrentUser(await loadUser(session?.user ?? null))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setCurrentUser(await loadUser(session?.user ?? null))
    })
    Promise.all([
      getListings().catch(e => { console.error('getListings failed:', e); return [] }),
      getStoreInventory().catch(e => { console.error('getStoreInventory failed:', e); return [] }),
    ]).then(([listings, storeItems]) => {
      const merged = [...listings, ...storeItems]
      setVinylList(merged)
      startCoverEnrichment(merged)
    })

    return () => {
      window.removeEventListener('popstate', handlePopState)
      subscription.unsubscribe()
    }
  }, [])

  function updateVinylItem(id, updates) {
    setVinylList(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
  }

  // Background cover enrichment — one Discogs lookup per album, 1 per 1.2s
  function startCoverEnrichment(items) {
    // Deduplicate: one item per albumId (or per store row if no albumId yet)
    const seenAlbums = new Set()
    const queue = items.filter(v => {
      if (v.type !== 'store' || v.img) return false
      if (v.albumId) {
        if (seenAlbums.has(v.albumId)) return false
        seenAlbums.add(v.albumId)
      }
      return true
    })
    if (!queue.length) return
    let i = 0
    function step() {
      if (i >= queue.length) return
      const item = queue[i++]
      lookupDiscogs(item.artist, item.title, { quick: true })
        .then(({ id: discogsId, img }) => {
          if (!img && !discogsId) return  // Discogs found nothing
          if (item.albumId) {
            // Save to albums table — covers all stores carrying this album
            const update = {}
            if (img) update.cover_image_url = img
            if (discogsId) update.discogs_id = String(discogsId)
            if (Object.keys(update).length)
              supabase.from('albums').update(update).eq('id', item.albumId).then(() => {}).catch(() => {})
          }
          if (img) {
            // Also save to store_inventory row (reliable anon-key path)
            const numId = item.id.replace('si-', '')
            supabase.from('store_inventory').update({ cover_image_url: img }).eq('id', numId).then(() => {}).catch(() => {})
          }
          // Update all items in memory that share this album (img AND discogsId)
          setVinylList(prev => prev.map(v => {
            const matchAlbum = item.albumId && v.albumId === item.albumId
            const matchItem  = v.id === item.id
            if (!matchAlbum && !matchItem) return v
            return {
              ...v,
              ...(img      ? { img }                   : {}),
              ...(discogsId ? { discogsId: String(discogsId) } : {}),
            }
          }))
        })
        .catch(() => {})
        .finally(() => setTimeout(step, 1200))
    }
    setTimeout(step, 2000) // start after 2s so initial render is fast
  }

  async function addVinyl(record) {
    try {
      const saved = await addListing(record)
      setVinylList(prev => [saved, ...prev])
    } catch (err) {
      console.error('addListing error:', err)
      setVinylList(prev => [record, ...prev])
    }
  }

  async function deleteVinyl(product) {
    await deleteListing(product)
    setVinylList(prev => prev.filter(v => v.id !== product.id))
  }

  async function editVinyl(id, updates) {
    try {
      await updateListing(id, updates)
      setVinylList(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
    } catch (err) {
      console.error('updateListing error:', err)
    }
  }

  function pushHistory(pageName, state) {
    history.pushState(state, '', PAGE_PATHS[pageName] || '/')
  }

  function handleLogin() {
    setPage('home')
    pushHistory('home', { page: 'home', searchQuery: '', searchGenre: '', selectedProduct: null, chatContext: null, editTarget: null })
    window.scrollTo(0, 0)
  }

  async function handleLogout() {
    await logout()
    setCurrentUser(null)
    setPage('home')
    pushHistory('home', { page: 'home', searchQuery: '', searchGenre: '', selectedProduct: null, chatContext: null, editTarget: null })
    window.scrollTo(0, 0)
  }

  async function handleUpdateUser(updates) {
    const updated = await updateUser(updates)
    if (updated) setCurrentUser(prev => ({ ...updated, isAdmin: prev?.isAdmin ?? false }))
  }

  function navigate(pageName, opts = {}) {
    // Auth guards
    if (!currentUser && ['upload', 'profile', 'edit', 'saved', 'chat'].includes(pageName)) {
      pageName = 'auth'
    }
    if (pageName === 'admin' && !checkIsAdmin(currentUser)) {
      pageName = 'home'
    }

    const nq = opts.query       !== undefined ? opts.query       : searchQuery
    const ng = opts.genre       !== undefined ? opts.genre       : searchGenre
    const np = opts.product     !== undefined ? opts.product     : selectedProduct
    const nl = opts.listing     !== undefined ? opts.listing     : editTarget
    const nc = opts.chatContext !== undefined ? opts.chatContext : chatContext

    if (opts.query       !== undefined) setSearchQuery(opts.query)
    if (opts.genre       !== undefined) setSearchGenre(opts.genre)
    if (opts.product     !== undefined) setSelectedProduct(opts.product)
    if (opts.listing     !== undefined) setEditTarget(opts.listing)
    if (opts.chatContext !== undefined) setChatContext(opts.chatContext)
    setPage(pageName)

    pushHistory(pageName, { page: pageName, searchQuery: nq, searchGenre: ng, selectedProduct: np, chatContext: nc, editTarget: nl })

    window.scrollTo(0, 0)
    if (opts.scrollTo) {
      setTimeout(() => document.getElementById(opts.scrollTo)?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }

  const shared = { currentUser, onLogout: handleLogout, onNavigate: navigate, onUpdateVinyl: updateVinylItem, onDeleteVinyl: deleteVinyl }

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
    return <ChatPage {...shared} chatContext={chatContext} />
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
