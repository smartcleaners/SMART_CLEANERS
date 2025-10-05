import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/combos" element={<Combos />} />
              <Route path="/bulk-orders" element={<BulkOrders />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/products/:productId" element={<ProductDetails />} />
              <Route path="/checkout" element={<CheckOut />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
