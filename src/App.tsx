import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Index from "./pages/Index.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import ProductCatalog from "./pages/ProductCatalog.tsx";
import ProductDetails from "./pages/ProductDetails.tsx";
import CategoryLanding from "./pages/CategoryLanding.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SpeedInsights />
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <CartDrawer />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/produtos" element={<ProductCatalog />} />
                <Route path="/categoria/:category" element={<CategoryLanding />} />
                <Route path="/legging-fitness" element={<CategoryLanding category="legging-fitness" />} />
                <Route path="/conjunto-fitness-feminino" element={<CategoryLanding category="conjunto-fitness-feminino" />} />
                <Route path="/tops-fitness" element={<CategoryLanding category="tops-fitness" />} />
                <Route path="/moda-fitness-mirassol" element={<CategoryLanding category="moda-fitness-mirassol" />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/:slug" element={<ProductDetails />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
