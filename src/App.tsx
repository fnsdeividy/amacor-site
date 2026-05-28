import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton'
import Home from './pages/Home'
import About from './pages/About'
import Plans from './pages/Plans'
import PlanExclusivoII from './pages/PlanExclusivoII'
import PlanCorporate from './pages/PlanCorporate'
import ProviderNetwork from './pages/ProviderNetwork'
import WaitingPeriodsIndividual from './pages/WaitingPeriodsIndividual'
import WaitingPeriodsCorporate from './pages/WaitingPeriodsCorporate'
import IDSS from './pages/IDSS'
import TISSManual from './pages/TISSManual'
import Contact from './pages/Contact'

function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-background-white">
      <Header currentPath={pathname} />
      <main className="flex-1 pt-[80px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/planos" element={<Plans />} />
          <Route path="/planos/exclusivo-ii" element={<PlanExclusivoII />} />
          <Route path="/planos/empresarial" element={<PlanCorporate />} />
          <Route path="/rede-credenciada" element={<ProviderNetwork />} />
          <Route path="/carencia-individual" element={<WaitingPeriodsIndividual />} />
          <Route path="/carencia-empresarial" element={<WaitingPeriodsCorporate />} />
          <Route path="/idss" element={<IDSS />} />
          <Route path="/manual-tiss" element={<TISSManual />} />
          <Route path="/contato" element={<Contact />} />
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
      <Layout />
    </BrowserRouter>
  )
}

export default App
