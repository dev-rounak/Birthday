// ============ 0. CHARACTER SPRITES ============
// Put each sprite as a transparent PNG in /public/media/character/
// Example: stand: "/media/character/stand.png"
export const character = {
  name: "Pratyusha",
  poses: {
    stand: "/media/character/stand.png",
    wave: "/media/character/wave.png",
    think: "/media/character/think.png",
    happy: "/media/character/happy.png",
    sit: "/media/character/sit.png",
    work: "/media/character/work.png",
    birthday: "/media/character/birthday.png",
    thinking: "/media/character/thinking.png",
    studying: "/media/character/studying.png",
    listening: "/media/character/listening.png",
    celebrating: "/media/character/celebrating.png",
  },
  faces: {
    smile: "/media/character/face-smile.png",
    wink: "/media/character/face-wink.png",
    surprised: "/media/character/face-surprised.png",
    angry: "/media/character/face-angry.png",
    sad: "/media/character/face-sad.png",
    blush: "/media/character/face-blush.png",
  },
  props: {
    laptop: "/media/character/laptop.png",
    backpack: "/media/character/backpack.png",
    books: "/media/character/books.png",
    bubbletea: "/media/character/bubbletea.png",
    headphones: "/media/character/headphones.png",
    cat: "/media/character/cat.png",
    phone: "/media/character/phone.png",
    cake: "/media/character/cake.png",
    heart: "/media/character/heart.png",
  },
}

// ============ 0b. WHAT SHE SAYS ON EACH PAGE ============
// Example: { pose:"wave", face:"smile", text:"Hi! Ready for your birthday mission?" }
export const dialogue = {
  gate: { pose: "wave", face: "smile", text: "Hi! Ready for your birthday mission?" },
  hub: { pose: "stand", face: "smile", text: "Welcome to the hub! Pick any module to begin." },
  cake: { pose: "birthday", face: "happy", text: "Make a wish and blow out the candles!" },
  memories: { pose: "think", face: "smile", text: "Let's look back at our favorite moments together." },
  gallery: { pose: "happy", face: "wink", text: "Here are some of my favorite photos of us!" },
  videos: { pose: "listening", face: "smile", text: "Watch some of our best video memories!" },
  reasons: { pose: "sit", face: "blush", text: "Here are all the reasons you're amazing." },
  quiz: { pose: "thinking", face: "surprised", text: "Think you know me well? Let's find out!" },
  game: { pose: "celebrating", face: "happy", text: "Time to play! Let's have some fun!" },
  wishes: { pose: "wave", face: "smile", text: "Send me your birthday wish!" },
  letter: { pose: "stand", face: "blush", text: "I wrote this letter just for you." },
  secret: { pose: "think", face: "wink", text: "You found the secret level... Enter the password!" },
}

// ============ 1. BASIC INFO ============
// Password is the date of birth typed as DDMMYYYY.
export const person = {
  name: "Pratyusha",
  dob: "2006-10-06",
  password: "06102006",
  hint: "The day you were born",
  from: "Rono",
  relationshipStart: "2024-08-11",
}

// ============ 2. MUSIC ============
// Put mp3 files in /public/media/music/. Example: { title:"Our Song", src:"/media/music/our-song.mp3" }
export const music = [
  { title: "Track 1", src: "/media/music/song1.mp3" },
]

// ============ 3. MEMORIES (Level 2) ============
// Images in /public/media/memories/, videos in /public/media/videos/.
// Photo: { date:"March 2019", title:"The day we met", story:"...", type:"image", src:"/media/memories/1.jpg" }
// Video: { date:"June 2021", title:"Beach trip", story:"...", type:"video", src:"/media/videos/beach.mp4" }
export const memories = [
  { date: "March 2019", title: "The day we met", story: "The moment everything began.", type: "image", src: "/media/memories/1.jpg" },
  { date: "July 2020", title: "First trip together", story: "We packed our bags and drove off into the unknown.", type: "image", src: "/media/memories/2.jpg" },
  { date: "December 2021", title: "Holiday celebration", story: "Lights, laughter, and way too much cake.", type: "image", src: "/media/memories/3.jpg" },
  { date: "August 2023", title: "Beach weekend", story: "Sun, sand, and the best company.", type: "video", src: "/media/videos/beach.mp4" },
]

// ============ 4. GALLERY (Level 3) ============
// Images in /public/media/gallery/. Example: { src:"/media/gallery/pic1.jpg", caption:"Best day ever", category:"Trips" }
export const gallery = [
  { src: "/media/gallery/pic1.jpg", caption: "Best day ever", category: "Trips" },
  { src: "/media/gallery/pic2.jpg", caption: "Coffee date", category: "Everyday" },
  { src: "/media/gallery/pic3.jpg", caption: "Sunset views", category: "Trips" },
  { src: "/media/gallery/pic4.jpg", caption: "Laughing together", category: "Everyday" },
  { src: "/media/gallery/pic5.jpg", caption: "Festival night", category: "Events" },
  { src: "/media/gallery/pic6.jpg", caption: "Cozy morning", category: "Everyday" },
  { src: "/media/gallery/pic7.jpg", caption: "Mountain hike", category: "Trips" },
  { src: "/media/gallery/pic8.jpg", caption: "Surprise party", category: "Events" },
]

// ============ 5. VIDEOS (Level 4) ============
// Local: { title:"Birthday message", type:"file", src:"/media/videos/msg.mp4", poster:"/media/videos/msg.jpg" }
// YouTube: { title:"Our trip", type:"youtube", src:"https://www.youtube.com/watch?v=XXXXXXXXXXX" }
export const videos = [
  { title: "Birthday message", type: "file", src: "/media/videos/msg.mp4", poster: "/media/videos/msg.jpg" },
  { title: "Our trip", type: "youtube", src: "https://www.youtube.com/watch?v=XXXXXXXXXXX" },
  { title: "Surprise moment", type: "file", src: "/media/videos/surprise.mp4", poster: "/media/videos/surprise.jpg" },
]

// ============ 6. REASONS (Level 5) ============
// Optional photo in /public/media/reasons/. Example: { text:"You make everyone laugh", photo:"/media/reasons/1.jpg" }
export const reasons = [
  { text: "You make everyone laugh", photo: "/media/reasons/1.jpg" },
  { text: "You always know how to cheer me up", photo: "/media/reasons/2.jpg" },
  { text: "You are incredibly kind and caring", photo: "/media/reasons/3.jpg" },
  { text: "You make every day an adventure", photo: "/media/reasons/4.jpg" },
  { text: "You are the best listener I know", photo: "/media/reasons/5.jpg" },
  { text: "You always believe in me", photo: "" },
  { text: "You have the most beautiful smile", photo: "/media/reasons/7.jpg" },
  { text: "You make ordinary moments feel special", photo: "" },
  { text: "You are my favorite person to be with", photo: "/media/reasons/9.jpg" },
  { text: "You are simply irreplaceable", photo: "" },
]

// ============ 7. QUIZ (Level 6) ============
// Example: { q:"Where did we first meet?", options:["School","Cafe","Park","Online"], answer:1 }
export const quiz = [
  { q: "Where did we first meet?", options: ["School", "Cafe", "Park", "Online"], answer: 1 },
  { q: "What is my favorite food?", options: ["Pizza", "Sushi", "Burger", "Pasta"], answer: 1 },
  { q: "Which color do I love most?", options: ["Red", "Blue", "Pink", "Green"], answer: 2 },
  { q: "What is my dream destination?", options: ["Paris", "Tokyo", "New York", "Maldives"], answer: 3 },
  { q: "What do I do when I'm stressed?", options: ["Sleep", "Cook", "Listen to music", "Call a friend"], answer: 2 },
  { q: "Which pet would I love to have?", options: ["Dog", "Cat", "Rabbit", "Fish"], answer: 1 },
]

// ============ 8. LETTER (Level 9) ============
// Voice note: put an mp3 in /public/media/voice/ then set voice:"/media/voice/note.mp3" (or "")
export const letter = {
  text: "Write your long heartfelt letter here...",
  voice: "",
}

// ============ 9. PRESET WISHES (Level 8) ============
// Example: { name:"Amit", text:"Happy birthday!" }
export const presetWishes = [
  { name: "Amit", text: "Happy birthday! Wishing you the best year ahead!" },
  { name: "Sara", text: "Have the most amazing birthday ever!" },
  { name: "Mom", text: "Happy birthday, my dear. So proud of you!" },
  { name: "Dad", text: "Wishing you joy and success always!" },
  { name: "Priya", text: "Another year of being awesome. Happy birthday!" },
]

// ============ 10. SECRET PAGE ============
export const secret = {
  message: "You found the secret level...",
  photo: "/media/secret.jpg",
  video: "",
}
