import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './Components/Header/Header'
import Hero from './Components/Hero/Hero'
import Footer from './Components/Footer/Footer'
import NewArrivals from './Components/NewArrivals/NewArrivals'
import Categories from './Components/Categories/Categories'
import Explore from './Components/Explore/Explore'
import ProductDetails from './Components/ProductDetails/ProductDetails'
import ExploreAll from './Components/ExploreAll/ExploreAll'
import Cart from './Components/Cart/Cart'
import { CartProvider } from './context/CartContext'
import Checkout from './Components/Checkout/Checkout'
import Shipping from './Components/Shipping/Shipping'
import OrderConfirmation from './Components/OrderConfirmation/OrderConfirmation'
import Trackorder from './Components/Trackorder/Trackorder'
import { AuthProvider, useAuth } from './context/AuthContext'
import Admin from './Components/Admin/Admin'
import { ProductsProvider } from './context/ProductsContext'
import { BillProvider } from './context/BillContext'

// Home Page Component
const HomePage = () => {
  return (
    <>
      <Hero />
      <NewArrivals />
      <Categories />
      <Explore />
    </>
  )
}

function AdminOnlyRoute() {
  const { user, loading } = useAuth() || {}
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  // Check both user object and token for admin access
  const token = localStorage.getItem('auth_token')
  const isAdmin = (user && (user.role === 'ADMIN' || user.role === 'admin')) || 
                  (token && user?.email === 'admin@gmail.com')
  
  if (isAdmin) {
    return <Admin />
  }
  return <Navigate to="/" replace />
}

function AppRoutesWrapper() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/explore-all" element={<ExploreAll />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/track" element={<Trackorder />} />
        <Route path="/admin" element={<AdminOnlyRoute />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BillProvider>
          <ProductsProvider>
            <Router>
              <AppRoutesWrapper />
            </Router>
          </ProductsProvider>
        </BillProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
