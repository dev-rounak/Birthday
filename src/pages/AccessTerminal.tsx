import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { person } from '../config.js'
import { useBuddy } from '../context/BuddyContext'
import { useMusic } from '../context/MusicContext'
import { useXP } from '../context/XPContext'
import { sfx } from '../utils/sfx'
import Sprite from '../components/Sprite'

interface ChatMessage {
  id: number
  sender: 'buddy' | 'user'
  text: string
  face?: string
}

function normalizePassword(input: string): string {
  return input.replace(/[^0-9]/g, '')
}

export default function AccessTerminal() {
  const navigate = useNavigate()
  const { say } = useBuddy()
  const { play } = useMusic()
  const { completeLevel } = useXP()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [failCount, setFailCount] = useState(0)
  const [isGranted, setIsGranted] = useState(false)
  const [shake, setShake] = useState(false)

  const chatBottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    const t1 = setTimeout(() => {
      setMessages([
        {
          id: 1,
          sender: 'buddy',
          text: `Hey ${person?.name || 'there'}! 👋 Welcome to your classified Birthday Mission.`,
          face: 'smile',
        },
      ])
      sfx?.pop?.()
      say('wave', `Hey ${person?.name || 'there'}! Ready for your birthday mission?`, 'smile')
    }, 500)

    const t2 = setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: 2,
          sender: 'buddy',
          text: 'To unlock mission clearance, I need your security passcode (Your DOB in DDMMYYYY format)!',
          face: 'wink',
        },
      ])
      sfx?.pop?.()
      inputRef.current?.focus()
    }, 1800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [say])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || isGranted) return

    const entered = inputText.trim()
    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: entered,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)
    sfx?.click?.()

    const normalized = normalizePassword(entered)
    const targetPassword = String(person?.password || person?.dob || '06102006').replace(/[^0-9]/g, '')

    setTimeout(() => {
      setIsTyping(false)

      if (normalized === targetPassword) {
        setIsGranted(true)
        sfx?.unlock?.()
        setTimeout(() => sfx?.success?.(), 300)

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'buddy',
            text: `Identity verified! Access Granted! Happy Birthday, ${person?.name || ''}! 🎉🎂`,
            face: 'smile',
          },
        ])

        say('celebrating', 'Passcode accepted! Launching Mission Control!', 'smile')
        play?.()
        completeLevel('gate')

        setTimeout(() => {
          navigate('/hub')
        }, 2200)
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 500)
        sfx?.pop?.()
        const nextFail = failCount + 1
        setFailCount(nextFail)

        let reply = 'Hmm, that passcode is not matching my database... Try again!'
        if (nextFail >= 2 && person?.hint) {
          reply = `Psst... here is a hint: "${person.hint}"!`
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'buddy',
            text: reply,
            face: nextFail >= 2 ? 'blush' : 'sad',
          },
        ])

        say('sad', 'Passcode mismatch! Try your birthday digits.', 'sad')
        inputRef.current?.focus()
      }
    }, 850)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-hidden">
      {/* Floating Retro Hologram Modal */}
      <div
        className={`w-full max-w-lg bg-navy-950/95 backdrop-blur-md border-2 border-neon-sky/80 flex flex-col shadow-[0_0_35px_rgba(56,189,248,0.35)] relative ${shake ? 'animate-bounce' : ''
          }`}
        style={{
          height: 'min(580px, 84vh)',
          borderRadius: '3px',
        }}
      >
        <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-neon-pink z-10 pointer-events-none" />
        <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-neon-pink z-10 pointer-events-none" />
        <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-neon-pink z-10 pointer-events-none" />
        <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-neon-pink z-10 pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="px-3 py-2 bg-navy-900 border-b border-neon-sky/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-pixel text-[8px] sm:text-[9px] text-neon-sky uppercase tracking-wider">
              TERMINAL UPLINK // {person?.name || 'USER'}
            </span>
          </div>
          <span className="font-pixel text-[6px] text-neon-pink uppercase tracking-widest">
            SECURE-CH: 06-10
          </span>
        </div>

        {/* Status Sub-bar */}
        <div className="px-3 py-2 bg-navy-950/90 border-b border-neon-sky/20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Sprite name="stand" kind="poses" scale={1.2} />
            <div>
              <div className="font-pixel text-[7px] text-neon-pink uppercase">
                Buddy AI
              </div>
              <div className="font-pixel text-[6px] text-green-400/80 uppercase">
                {isGranted ? 'CLEARANCE ACCEPTED' : 'ONLINE • AWAITING DOB'}
              </div>
            </div>
          </div>
          <div className="font-pixel text-[6px] text-soft/40 uppercase text-right">
            FORMAT: DDMMYYYY
          </div>
        </div>

        {/* Scrollable Conversation Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 custom-scrollbar">
          {messages.map((m) => {
            const isBuddy = m.sender === 'buddy'

            return (
              <div
                key={m.id}
                className={`flex items-start gap-2 ${isBuddy ? 'justify-start' : 'justify-end'
                  }`}
              >
                {isBuddy && (
                  <div className="flex-shrink-0 mt-0.5">
                    <Sprite name={m.face || 'smile'} kind="faces" scale={1.2} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] px-3 py-2 font-body text-xs sm:text-sm leading-relaxed ${isBuddy
                      ? 'bg-navy-900/90 border border-neon-sky/50 text-soft shadow-[0_0_10px_rgba(56,189,248,0.15)]'
                      : 'bg-neon-pink/25 border border-neon-pink text-white shadow-[0_0_12px_rgba(244,114,182,0.25)]'
                    }`}
                  style={{ borderRadius: '2px' }}
                >
                  {m.text}
                </div>
              </div>
            )
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-neon-sky font-pixel text-[7px] pl-1 animate-pulse">
              <span>Buddy is typing</span>
              <span>...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Form Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-2 sm:p-2.5 bg-navy-900 border-t border-neon-sky/30 flex items-center gap-2 flex-shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            disabled={isGranted}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isGranted
                ? 'Mission clearance accepted! 🚀'
                : 'Enter your birthdate (DDMMYYYY)...'
            }
            className="flex-1 bg-navy-950 border border-neon-sky/50 px-3 py-2 font-body text-xs sm:text-sm text-white placeholder:text-soft/40 outline-none focus:border-neon-pink transition-all"
            style={{ borderRadius: '2px' }}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isGranted}
            className="font-pixel text-[7px] sm:text-[8px] uppercase px-3.5 py-2 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink/20 transition-all disabled:opacity-40 active:scale-95 shadow-[0_0_10px_rgba(244,114,182,0.3)] flex-shrink-0"
            style={{ borderRadius: '2px' }}
          >
            SEND ▶
          </button>
        </form>
      </div>
    </div>
  )
}