export const character: {
  name: string
  poses: Record<string, string>
  faces: Record<string, string>
  props: Record<string, string>
}
export const dialogue: Record<string, { pose: string; face: string; text: string }>
export const person: {
  name: string
  dob: string
  password: string
  hint: string
  from: string
  relationshipStart: string
}
export const music: { title: string; src: string }[]
export const memories: { date: string; title: string; story: string; type: string; src: string }[]
export const gallery = [
  {
    src: '/assets/gallery/photo1.jpg',
    type: 'photo',
    caption: 'Our First Adventure',
    category: 'trips',
  },
  {
    src: '/assets/gallery/photo2.jpg',
    type: 'photo',
    caption: 'Beach Sunset',
    category: 'dates',
  },
  {
    src: '/assets/gallery/photo3.jpg',
    type: 'photo',
    caption: 'Beach Sunset',
    category: 'dates',
  },
  {
    src: '/assets/gallery/photo4.jpg',
    type: 'photo',
    caption: 'Beach Sunset',
    category: 'dates',
  },
  {
    src: '/assets/gallery/photo5.jpg',
    type: 'photo',
    caption: 'Beach Sunset',
    category: 'dates',
  },
  {
    src: '/assets/gallery/photo6.jpg',
    type: 'photo',
    caption: 'Beach Sunset',
    category: 'dates',
  },
  {
    src: '/assets/gallery/photo7.jpg',
    type: 'photo',
    caption: 'Beach Sunset',
    category: 'dates',
  },
  {
    src: '/assets/gallery/photo8.jpg',
    type: 'photo',
    caption: 'Beach Sunset',
    category: 'dates',
  },
  {
    src: '/assets/gallery/photo9.jpg',
    type: 'photo',
    caption: 'Beach Sunset',
    category: 'dates',
  },
  {
    src: '/assets/gallery/photo10.jpg',
    type: 'photo',
    caption: 'Beach Sunset',
    category: 'dates',
  },
]
export const videos: { title: string; type: string; src: string; poster?: string }[]
export const reasons: { text: string; photo: string }[]
export const quiz: { q: string; options: string[]; answer: number }[]
export const letter: { text: string; voice: string }
export const presetWishes: { name: string; text: string }[]
export const secret: { message: string; photo: string; video: string }
