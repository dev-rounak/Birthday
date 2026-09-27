import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CursorEffects from './components/CursorEffects'
import { XPProvider } from './context/XPContext'
import { BuddyProvider } from './context/BuddyContext'
import { MusicProvider } from './context/MusicContext'
import AccessTerminal from './pages/AccessTerminal'
import Hub from './pages/Hub'
import Cake from './pages/Cake'
import PlaceholderPage from './pages/PlaceholderPage'
import NotFound from './pages/NotFound'
import Gallery from './pages/Gallery'
import Reasons from './pages/Reasons'
import Arcade from './pages/Arcade'
import Letter from './pages/Letter'
import Awards from './pages/Awards'

function App() {
  return (
    <XPProvider>
      <MusicProvider>
        <BuddyProvider>
          <BrowserRouter>
            <CursorEffects />
            <Layout>
              <Routes>
                <Route path="/" element={<AccessTerminal />} />
                <Route path="/hub" element={<Hub />} />
                <Route path="/cake" element={<Cake />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/reasons" element={<Reasons />} />
                <Route path="/videos" element={<PlaceholderPage title="Video Logs" icon="▶" description="Moving memories from the timeline." glow="pink" />} />
                <Route path="/reasons" element={<PlaceholderPage title="Reasons" icon="★" description="Reasons why you make the world brighter." />} />
                <Route path="/arcade" element={<Arcade />} />
                <Route path="/letter" element={<Letter />} />
                <Route path="/awards" element={<Awards />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </BuddyProvider>
      </MusicProvider>
    </XPProvider>
  )
}

export default App
