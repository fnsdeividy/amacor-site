import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton'
import { AuthProvider } from './contexts/AuthContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import { AdminRoute } from './components/Guards/AdminRoute'
import { BeneficiaryRoute } from './components/Guards/BeneficiaryRoute'
import Home from './pages/Home'
import Plans from './pages/Plans'
import PlanExclusivoI from './pages/PlanExclusivoI'
import PlanExclusivoII from './pages/PlanExclusivoII'
import PlanMaisComFranquia from './pages/PlanMaisComFranquia'
import PlanCorporate from './pages/PlanCorporate'
import Telemedicine from './pages/Telemedicine'
import Institutional from './pages/Institutional'
import ProviderNetwork from './pages/ProviderNetwork'
import WaitingPeriodsIndividual from './pages/WaitingPeriodsIndividual'
import WaitingPeriodsCorporate from './pages/WaitingPeriodsCorporate'
import IDSS from './pages/IDSS'
import TISSManual from './pages/TISSManual'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import BeneficiaryArea from './pages/BeneficiaryArea'
import ExamSearch from './pages/ExamSearch'

// Admin pages
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminSolicitacoes from './pages/Admin/AdminSolicitacoes'
import AdminSolicitacaoDetalhe from './pages/Admin/AdminSolicitacaoDetalhe'

// Beneficiary pages
import BeneficiaryBoletos from './pages/Beneficiary/BeneficiaryBoletos'
import BeneficiarySolicitacoes from './pages/Beneficiary/BeneficiarySolicitacoes'
import BeneficiaryNovaSolicitacao from './pages/Beneficiary/BeneficiaryNovaSolicitacao'
import BeneficiarySolicitacaoDetalhe from './pages/Beneficiary/BeneficiarySolicitacaoDetalhe'

function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-background-white">
      <Header currentPath={pathname} />
      <main className="flex-1 pt-[80px]">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Navigate to="/institucional" replace />} />
          <Route path="/planos" element={<Plans />} />
          <Route path="/planos/exclusivo-i" element={<PlanExclusivoI />} />
          <Route path="/planos/exclusivo-ii" element={<PlanExclusivoII />} />
          <Route path="/planos/mais-com-franquia" element={<PlanMaisComFranquia />} />
          <Route path="/planos/empresarial" element={<PlanCorporate />} />
          <Route path="/telemedicina" element={<Telemedicine />} />
          <Route path="/institucional" element={<Institutional />} />
          <Route path="/rede-credenciada" element={<ProviderNetwork />} />
          <Route path="/carencia-individual" element={<WaitingPeriodsIndividual />} />
          <Route path="/carencia-empresarial" element={<WaitingPeriodsCorporate />} />
          <Route path="/idss" element={<IDSS />} />
          <Route path="/manual-tiss" element={<TISSManual />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/beneficiario" element={<BeneficiaryArea />} />
          <Route path="/buscar-exames" element={<ExamSearch />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/solicitacoes" element={<AdminRoute><AdminSolicitacoes /></AdminRoute>} />
          <Route path="/admin/solicitacoes/:id" element={<AdminRoute><AdminSolicitacaoDetalhe /></AdminRoute>} />

          {/* Beneficiary protected routes */}
          <Route path="/beneficiario/boletos" element={<BeneficiaryRoute><BeneficiaryBoletos /></BeneficiaryRoute>} />
          <Route path="/beneficiario/solicitacoes" element={<BeneficiaryRoute><BeneficiarySolicitacoes /></BeneficiaryRoute>} />
          <Route path="/beneficiario/solicitacoes/nova" element={<BeneficiaryRoute><BeneficiaryNovaSolicitacao /></BeneficiaryRoute>} />
          <Route path="/beneficiario/solicitacoes/:id" element={<BeneficiaryRoute><BeneficiarySolicitacaoDetalhe /></BeneficiaryRoute>} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton phoneNumber="5521999999999" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <Layout />
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
