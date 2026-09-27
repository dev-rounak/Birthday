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
export const gallery: { src: string; caption: string; category: string }[]
export const videos: { title: string; type: string; src: string; poster?: string }[]
export const reasons: { text: string; photo: string }[]
export const quiz: { q: string; options: string[]; answer: number }[]
export const letter: { text: string; voice: string }
export const presetWishes: { name: string; text: string }[]
export const secret: { message: string; photo: string; video: string }
