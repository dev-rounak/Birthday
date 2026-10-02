import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CursorEffects from './components/CursorEffects'
import { XPProvider } from './context/XPContext'
import { BuddyProvider } from './context/BuddyContext'
import { MusicProvider } from './context/MusicContext'
import AccessTerminal from './pages/AccessTerminal'
import Hub from './pages/Hub'
import Cake from './pages/Cake'
import Gallery from './pages/Gallery'
import Reasons from './pages/Reasons'
import Arcade from './pages/Arcade'
import Letter from './pages/Letter'
import Awards from './pages/Awards'
import NotFound from './pages/NotFound'
import RouteGuard from './components/RouteGuard'

function App() {
  return (
    <XPProvider>
      <MusicProvider>
        <BuddyProvider>
          <BrowserRouter>
            <CursorEffects />
            <Layout>
              <Routes>
                {/* Level 0: Always accessible */}
                <Route path="/" element={<AccessTerminal />} />

                {/* Level 1: Requires terminal password completed */}
                <Route
                  path="/hub"
                  element={
                    <RouteGuard levelId="hub">
                      <Hub />
                    </RouteGuard>
                  }
                />

                {/* Level 2: Requires Hub */}
                <Route
                  path="/cake"
                  element={
                    <RouteGuard levelId="cake">
                      <Cake />
                    </RouteGuard>
                  }
                />

                {/* Level 3: Requires Cake completed */}
                <Route
                  path="/gallery"
                  element={
                    <RouteGuard levelId="gallery">
                      <Gallery />
                    </RouteGuard>
                  }
                />

                {/* Level 4: Requires Gallery completed */}
                <Route
                  path="/reasons"
                  element={
                    <RouteGuard levelId="reasons">
                      <Reasons />
                    </RouteGuard>
                  }
                />

                {/* Level 5: Requires Reasons completed */}
                <Route
                  path="/arcade"
                  element={
                    <RouteGuard levelId="arcade">
                      <Arcade />
                    </RouteGuard>
                  }
                />

                {/* Level 6: Requires Arcade completed */}
                <Route
                  path="/letter"
                  element={
                    <RouteGuard levelId="letter">
                      <Letter />
                    </RouteGuard>
                  }
                />

                {/* Level 7: Final Level */}
                <Route
                  path="/awards"
                  element={
                    <RouteGuard levelId="awards">
                      <Awards />
                    </RouteGuard>
                  }
                />

                {/* 404 fallback */}
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