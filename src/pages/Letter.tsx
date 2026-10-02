import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { person, dialogue } from '../config.js'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { sfx } from '../utils/sfx'
import Sprite from '../components/Sprite'
import Confetti from '../components/Confetti'

// =========================================================================
// 📝 YOUR PERSONAL HEARTFELT LETTER
// =========================================================================
const LETTER_BODY = `Baby... ami janina tui kar nam likhechis oikhane mane oi the "person u loved the most" oi Q tay...aei letter emni tor jonne ❤️

Its been 2+ yrs with u baby and there was not a single day that i did not wanted to talk to u. Tui bolish thik e je this obsession is not good but for me...i mean i worship u baby....i call u in my prayers....emon kono din nei je ami tor kotha bhabini, tor jonne bhabini....its everything and always for u baby. 🥹❤️

Ami ekta bhul korechilam kichu mash aage....amr bhul hoye geche biswas kor...biswas kor amr hoito akhono onek female frnds ache (online/offline) but karur shonge oirokom relation and obession nei and trust me baby ami rakhteo chaina....when i got the most expensive gem in our universe why will I care abt gold...💎❤️ BHUL HOYECHE PAP KORECHI AND AR KONODINO KORBONA I PROMISE...U CAN TRUST ME😌❤️

Tui amar chokhe jotota strong, seta hoyto tui nijeo sobsomoy bujhte parish na. Jibone onek kichu ashe, onek kichu tough hoye jay, kokhono kokhono tui-o bhenghe porish, mon kharap hoy, nijeke niye doubt koris… kintu tarporo tui abar nijeke samle nis. Abar uthe darash. Abar chesta koris. Aar ei jinish-ta ami tor moddhe khub admire kori. ❤️

Tui strong mane ei na je tui kokhono kandbi na, kokhono koshto pabi na, ba sobsomoy sobkichu handle korte parbi. Amar kache strong howa mane holo — koshto pawar poreo nijer moddher bhalo manush-ta ke hariye na fela. Aar tui thik etai koris. 🫶

Tor moddhe ekta khub shundor softness ache. Tui manushder niye care koris, choto choto jinish notice koris, jar jonno tor bhalobasha ache tar jonno nijer moto kore chesta koris. Hoyto sobsomoy tui seta mukhe bolish na, kintu tor kajer moddhe seta dekha jay. ❤️

Tor kichu stubbornness ache, kichu paglamo ache, kichu mood swing ache, kokhono tui unnecessarily overthink koris, abar kokhono nijer kotha nijer moddhei rekhe dish. Kintu janis ki? Ei sobkichu milei tui tui. Aar amar kache tor ei perfect, real version-tai sobcheye beshi precious. 🥹❤️

Ami chai tui kokhono nijeke choto kore dekhish na. Kokhono bhabish na je tui enough na. Karon ami tor moddhe emon ekjon manush dekhi je nijer shopno, nijer bhalobasha, nijer manushder jonno mon theke fight korte pare. Tui hoyto nijer strength-ta protidin feel koris na, kintu ami kori. Aar jodi kokhono tui nijeke niye doubt koris, tahole amar kache fire ashish — ami toke abar mone koriye debo tui ashole koto ta strong, koto ta bhalo, aar koto ta special. ❤️‍🩹

Tor moto ekta bhalo moner manush amar jibone thaka amar kache kono choto bishoy na. Aar ami honestly khub grateful je tor moto ekjonke amar eto kache peyechi. 🥹❤️

I was never the person u wanted ....amr kache kichu nei toke dewar ..na taka na gifts na baki bf der moto enjoyment ....kichu parina, ami loser kintu tao tui ami choose korechis ebong ekbar na bar bar... I REALLY AM GREATFUL FOR THAT. ❤️

I don't think I've ever properly told you just how much I love you. ❤️
Not just in the simple way of saying "I love you" every day, but in all the little ways that those three words can never completely explain. 🥹

I love you in the way I look for your name on my phone without even realizing it. 📱❤️
I love you in the way something happens during my day and my first thought is, "I need to tell her this."
I love the way your happiness can become my happiness, and somehow your smallest problems can make me worry more than my own.

I love your presence. ❤️
I love knowing that somewhere in this huge world, there is a person who is you. Someone whose voice I know, whose laugh I know, whose little habits I've slowly started memorizing without even trying. 🫶
And sometimes I just stop and think about how strange and beautiful it is that out of all the people in this world, I found you. ✨

If I could explain what you mean to me perfectly, maybe I would write a thousand pages and still feel like I had left something out. 📖❤️
There is a line by Shakespeare that says, "I do love nothing in the world so well as you." And honestly, sometimes that is exactly how I feel. ❤️

I love you not only for the beautiful moments, but for the ordinary ones too. The random conversations. The stupid jokes. The times we don't even have anything important to say. The moments when we're just existing together. Because with you, even ordinary moments somehow become memories that I want to keep forever. 🥹❤️

And I don't love you because I think you're perfect.
I love you because you're real. ❤️
I love the way you get excited over little things. I love your smile. 😊 I love your eyes. 👀 I love your voice. I love your personality, even the parts that drive me slightly crazy sometimes. 😭 I love your stubbornness, your softness, your strength, your silly side, your serious side, and all those tiny things that make you you. ❤️

There's another beautiful line from Elizabeth Barrett Browning's poem:
"How do I love thee? Let me count the ways." ❤️
And if I actually tried to count them, I don't think I would ever finish. ♾️
Because my love for you isn't just one big feeling. It's hidden in hundreds of tiny things. 🫶

It's in every "good morning." ☀️
Every "have you eaten?" ❤️
Every time I want to hear your voice. 🎧
Every time I see something that reminds me of you. 🥹
Every time I imagine a future and somehow you're already there in it. ❤️

You have become such a beautiful part of my life that sometimes I can't remember what it felt like before you were in it. 🫂
And if someday you ever wonder whether you're loved, I hope you remember this: ❤️
There is someone who looks at you and sees far more than just a pretty face. 🥹
Someone who sees your heart. ❤️
Someone who sees how hard you try. 🫶
Someone who notices the little things. ✨
Someone who is proud of the person you are becoming. ❤️
Someone who wants to be there not only when everything is beautiful, but also when life gets difficult. 🫂
Someone who wants to celebrate your happiest days and hold your hand through the ones that aren't. ❤️
That someone is me. ❤️

I don't know what the future has written for us. I don't know what every tomorrow will look like. But I do know that right now, in this moment, I love you more than I know how to put into words. 🥹❤️

And if I could give you one thing, it would be the ability to see yourself through my eyes for just one minute. 👀❤️️
Maybe then you'd finally understand why I look at you the way I do.
Maybe then you'd understand why your smile can change my entire day. 😊❤️
Maybe then you'd understand why losing you is one of the things I never even want to imagine. 🥹

And maybe then you'd understand that when I say "I love you," I don't mean it as just a sentence. ❤️
I mean:
I choose you. ❤️
I care about you. 🫶
I believe in you. ✨
I admire you. ❤️
I want to see you happy. 😊
I want to see you achieve everything you dream about. 🌟
I want to be there for the little things and the big things. 🫂
And more than anything, I want you to always know that somewhere in this enormous world, there is a person whose heart feels a little more at home because you exist. 🏡❤️

I love you. ❤️
More than yesterday, less than tomorrow. ♾️❤️

CALL IT OBSESSION. I CALL IT WORSHIP ❤️‍🔥
EVERY INCH OF U IS HOLY TO ME. ❤️‍‍🔥

And no matter how many times I say it, somehow those three words will always feel too small for everything I feel for you. ❤️`
// =========================================================================

export default function Letter() {
    const navigate = useNavigate()
    const { say } = useBuddy()
    const { completeLevel, isLevelCompleted } = useXP()

    // Retrieve secretly stored answers from the Arcade page
    const [datePlan, setDatePlan] = useState<string>('')
    const [lovedOne, setLovedOne] = useState<string>('')

    // Typewriter effect state
    const [displayedText, setDisplayedText] = useState('')
    const [isTypingDone, setIsTypingDone] = useState(false)
    const typingTimerRef = useRef<number | null>(null)

    useEffect(() => {
        // Read secret answers recorded in Arcade
        const storedDate = localStorage.getItem('bm_date_plan') || 'A romantic surprise sunset date'
        const storedLove = localStorage.getItem('bm_love_most') || 'You'
        setDatePlan(storedDate)
        setLovedOne(storedLove)

        const letterDialogue =
            dialogue?.letter?.text || 'A special letter written just for you. Open your heart!'
        say('happy', letterDialogue, 'smile')
    }, [say])

    // Typewriter effect
    useEffect(() => {
        let index = 0
        const fullText = LETTER_BODY

        const typeChar = () => {
            index++
            setDisplayedText(fullText.slice(0, index))

            if (index < fullText.length) {
                typingTimerRef.current = window.setTimeout(typeChar, 14)
            } else {
                setIsTypingDone(true)
                if (!isLevelCompleted('letter')) {
                    sfx?.success?.()
                    completeLevel('letter', 50)
                    say('blush', 'Every single word is from the bottom of my heart.', 'smile')
                }
            }
        }

        typingTimerRef.current = window.setTimeout(typeChar, 300)

        return () => {
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        }
    }, [completeLevel, isLevelCompleted, say])

    // Instant skip typewriter
    const handleSkipTyping = () => {
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        setDisplayedText(LETTER_BODY)
        setIsTypingDone(true)
        if (!isLevelCompleted('letter')) {
            completeLevel('letter', 50)
        }
    }

    return (
        <div className="relative w-full max-w-3xl mx-auto px-4 py-6 flex flex-col items-center select-none pb-28">
            {/* Sector Header */}
            <div className="text-center space-y-2 mb-6">
                <div className="font-pixel text-[8px] sm:text-[9px] text-neon-pink uppercase tracking-widest">
                    {'◀'} SECTOR 06: LOVE LETTER {'▶'}
                </div>
                <h1 className="font-pixel text-xl sm:text-2xl text-soft uppercase tracking-wider">
                    A Message From My Heart
                </h1>
                <p className="font-body text-xs sm:text-sm text-soft/60">
                    Declassified Birthday Transmission
                </p>

                <div className="flex justify-center pt-2">
                    <Sprite name="happy" kind="poses" scale={2.4} />
                </div>
            </div>

            {/* Main Letter Terminal Container */}
            <div
                className="w-full bg-navy-900/90 backdrop-blur-md border-2 border-neon-sky/60 p-5 sm:p-8 shadow-[0_0_30px_rgba(56,189,248,0.25)] relative"
                style={{ borderRadius: '2px' }}
            >
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-pink pointer-events-none" />
                <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-pink pointer-events-none" />
                <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-pink pointer-events-none" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-pink pointer-events-none" />

                {/* Top Header of the Letter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neon-sky/30 pb-4 mb-6 gap-3">
                    <div>
                        <div className="font-pixel text-[7px] text-neon-pink uppercase tracking-widest">
                            CONFIDENTIAL TRANSMISSION
                        </div>
                        <div className="font-pixel text-xs sm:text-sm text-neon-sky uppercase mt-1">
                            TO: {person?.name || 'My Favorite Person'}
                        </div>
                    </div>

                    {!isTypingDone && (
                        <div>
                            <button
                                onClick={handleSkipTyping}
                                className="font-pixel text-[7px] uppercase px-3 py-1.5 border border-soft/40 text-soft hover:border-neon-sky hover:text-neon-sky transition-all active:scale-95"
                                style={{ borderRadius: '2px' }}
                            >
                                Skip Typing ⏭
                            </button>
                        </div>
                    )}
                </div>

                {/* Decoded Arcade Intel Box */}
                <div
                    className="mb-6 p-4 bg-navy-950/80 border border-neon-pink/50 space-y-3"
                    style={{ borderRadius: '2px', boxShadow: '0 0 14px rgba(244,114,182,0.15)' }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-neon-pink text-xs">🔒</span>
                        <span className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest">
                            Decoded Intel From Arcade
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-2.5 bg-navy-900/60 border border-neon-sky/30">
                            <span className="font-pixel text-[6px] text-neon-sky/70 uppercase block mb-1">
                                Her Dream Date Plan:
                            </span>
                            <p className="font-body text-xs sm:text-sm text-soft italic font-medium">
                                "{datePlan}"
                            </p>
                        </div>

                        <div className="p-2.5 bg-navy-900/60 border border-neon-sky/30">
                            <span className="font-pixel text-[6px] text-neon-sky/70 uppercase block mb-1">
                                Whom She Loves Most:
                            </span>
                            <p className="font-body text-xs sm:text-sm text-neon-pink italic font-medium">
                                "{lovedOne}"
                            </p>
                        </div>
                    </div>

                    <div className="font-pixel text-[6px] text-soft/40 pt-1 text-center sm:text-left">
                        * I took notes of every single word. Now here is what I wanted to tell you:
                    </div>
                </div>

                {/* Main Letter Body */}
                <div className="min-h-[220px] font-body text-sm sm:text-base text-soft leading-relaxed whitespace-pre-line tracking-wide">
                    {displayedText}
                    {!isTypingDone && (
                        <span className="cursor-blink text-neon-sky font-bold ml-1">▌</span>
                    )}
                </div>

                {/* Letter Signoff */}
                {isTypingDone && (
                    <div className="mt-8 pt-4 border-t border-neon-sky/20 flex flex-col items-end animate-fade-in">
                        <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest">
                            Forever & Always,
                        </div>
                        <div className="font-pixel text-xs sm:text-sm text-neon-sky uppercase mt-1">
                            With all my love ❤️
                        </div>
                    </div>
                )}
            </div>

            {isTypingDone && <Confetti active={true} />}

            {/* Sequential Links */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
                <Link
                    to="/arcade"
                    className="font-pixel text-[8px] sm:text-[9px] uppercase px-4 py-2.5 border border-neon-blue/40 text-soft/70 bg-navy-900/90 hover:bg-neon-sky/10 transition-all"
                    style={{ borderRadius: '2px' }}
                >
                    {'◀'} Arcade Arena
                </Link>

                <button
                    onClick={() => {
                        if (!isLevelCompleted('letter')) {
                            completeLevel('letter', 50)
                        }
                        sfx?.success?.()
                        navigate('/awards')
                    }}
                    className="font-pixel text-[9px] sm:text-[10px] uppercase px-6 py-2.5 border-2 border-neon-sky text-neon-sky bg-navy-900 hover:bg-neon-sky/20 transition-all shadow-[0_0_16px_rgba(56,189,248,0.4)] active:scale-95 flex items-center gap-2"
                    style={{ borderRadius: '2px' }}
                >
                    <span>Final Sector: Hall of Awards</span>
                    <span>♛</span>
                </button>
            </div>
        </div>
    )
}