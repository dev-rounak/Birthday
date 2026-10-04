// ============ 0. CHARACTER SPRITES ============
// Put each sprite as a transparent PNG in /public/media/character/
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
// Put mp3 files in /public/media/music/
// ============ 2. MUSIC ============
export const music = [
  {
    title: "Our Song",              // Displays on the player HUD
    src: "/media/music/gallery-song.mp3"
  },
]

// ============ 3. MEMORIES ============
// Kept empty so it does not conflict with or add broken placeholder cards into Gallery
export const memories = []

// =========================================================================
// 📸 HALL OF FAME / GALLERY RECORDS
// Ensure the file names match what is saved in public/assets/gallery/
// =========================================================================
export const gallery = [
  { src: '/assets/gallery/photo1.jpeg', type: 'photo' },
  { src: '/assets/gallery/photo2.jpeg', type: 'photo' },
  { src: '/assets/gallery/photo3.jpeg', type: 'photo' },
  { src: '/assets/gallery/photo4.jpeg', type: 'photo' },
  { src: '/assets/gallery/photo5.jpeg', type: 'photo' },
  { src: '/assets/gallery/photo6.jpeg', type: 'photo' },
  { src: '/assets/gallery/photo7.jpeg', type: 'photo' },
  { src: '/assets/gallery/photo8.jpeg', type: 'photo' },
  { src: '/assets/gallery/photo9.jpeg', type: 'photo' },
  { src: '/assets/gallery/photo10.jpeg', type: 'photo' },
]

// ============ 5. VIDEOS ============
export const videos = [
  {
    title: 'You',
    caption: 'Our Special Video',
    src: '/assets/gallery/video.mp4',
    type: 'video',
  },
]

// ============ 6. REASONS ============
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

// ============ 7. QUIZ ============
export const quiz = [
  { q: "Where did we first meet?", options: ["School", "Cafe", "Park", "Online"], answer: 1 },
  { q: "What is my favorite food?", options: ["Pizza", "Sushi", "Burger", "Pasta"], answer: 1 },
  { q: "Which color do I love most?", options: ["Red", "Blue", "Pink", "Green"], answer: 2 },
  { q: "What is my dream destination?", options: ["Paris", "Tokyo", "New York", "Maldives"], answer: 3 },
  { q: "What do I do when I'm stressed?", options: ["Sleep", "Cook", "Listen to music", "Call a friend"], answer: 2 },
  { q: "Which pet would I love to have?", options: ["Dog", "Cat", "Rabbit", "Fish"], answer: 1 },
]

// ============ 8. LETTER ============
export const letter = {
  text: "Write your long heartfelt letter here...",
  voice: "",
}

// ============ 9. PRESET WISHES ============
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