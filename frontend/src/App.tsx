import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Signup } from "@/pages/Signup"
import { Signin } from "@/pages/Signin"
import { Dashboard } from "@/pages/Dashboard"
import { Analytics } from "@/pages/Analytics"
import { MemoryVault } from "@/pages/MemoryVault"
import { Connect } from "@/pages/Connect"
import { SharedBrain } from "@/pages/SharedBrain"
import { Home } from "@/pages/Home"
import { TagsPage } from "@/pages/TagsPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { PublicRoute } from "@/components/PublicRoute"

function App() {
  const isAuthenticated = () => !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Home />} />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        <Route path="/signin" element={
          <PublicRoute>
            <Signin />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard/tags" element={
          <ProtectedRoute>
            <TagsPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/memory-vault" element={
          <ProtectedRoute>
            <MemoryVault />
          </ProtectedRoute>
        } />
        <Route path="/connect" element={
          <ProtectedRoute>
            <Connect />
          </ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path="/share/:hash" element={<SharedBrain />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
