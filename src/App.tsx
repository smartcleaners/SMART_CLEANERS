import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; // <-- Added useLocation
import { useEffect } from "react"; // <-- Added useEffect
import { CartProvider } from "@/contexts/CartContext";
import { Layout } from "@/components/layout/Layout";
import { Home } from "./pages/Home";
import { Categories } from "./pages/Categories";
import { Combos } from "./pages/Combos";
import { BulkOrders } from "./pages/BulkOrders";
import NotFound from "./pages/NotFound";
import CartPage from "./pages/CartPage";
import { CheckOut } from "./pages/CheckOut";
import { ProductDetails } from "./pages/ProductPage";
import { AboutUs } from "./pages/about";

const queryClient = new QueryClient();

// --- START of the fix ---
// 1. Create a component to handle the scroll
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls to the top left of the document on route change
    window.scrollTo(0, 0);
  }, [pathname]); // Reruns every time the 'pathname' (route) changes

  return null; // This component doesn't render anything
};
// --- END of the fix ---

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* 2. Place the new component inside BrowserRouter */}
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/combos" element={<Combos />} />
              <Route path="/bulk-orders" element={<BulkOrders />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/products/:productId" element={<ProductDetails />} />
              <Route path="/checkout" element={<CheckOut />} />
              <Route path="/about" element={<AboutUs />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;