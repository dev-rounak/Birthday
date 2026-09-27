import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CursorEffects from './components/CursorEffects'
import { XPProvider } from './context/XPContext'
import { BuddyProvider } from './context/BuddyContext'
import { MusicProvider } from './context/MusicContext'
import AccessTerminal from './pages/AccessTerminal'
import Hub from './pages/Hub'
import Cake from './pages/Cake'
import Memories from './pages/Memories'
import PlaceholderPage from './pages/PlaceholderPage'
import NotFound from './pages/NotFound'

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
              <Route path="/memories" element={<Memories />} />
              <Route path="/gallery" element={<PlaceholderPage title="Photo Gallery" icon="▣" description="A visual record of adventures together." />} />
              <Route path="/videos" element={<PlaceholderPage title="Video Logs" icon="▶" description="Moving memories from the timeline." glow="pink" />} />
              <Route path="/reasons" element={<PlaceholderPage title="Reasons" icon="★" description="Reasons why you make the world brighter." />} />
              <Route path="/quiz" element={<PlaceholderPage title="Quiz Zone" icon="?" description="Test your knowledge of the birthday legend." glow="pink" />} />
              <Route path="/game" element={<PlaceholderPage title="Arcade" icon="◆" description="Insert coin to play the birthday game." />} />
              <Route path="/wishes" element={<PlaceholderPage title="Wish Board" icon="✦" description="Messages from friends and family." glow="pink" />} />
              <Route path="/letter" element={<PlaceholderPage title="Letter" icon="✉" description="A personal note written just for you." />} />
              <Route path="/secret" element={<PlaceholderPage title="Secret Vault" icon="⚷" description="Enter passcode to unlock hidden content." glow="pink" />} />
              <Route path="/achievements" element={<PlaceholderPage title="Achievements" icon="♛" description="Trophies and milestones unlocked." />} />
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
