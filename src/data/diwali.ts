/**
 * Diwali 2026 festival days. Dates follow commonly published 2026 calendars (6–10 November).
 * Exact dates and timings can differ by region and panchang, so the UI says so.
 */
export interface FestivalDay {
  key: string
  n: number
  name: string
  alt: string
  date: string // ISO yyyy-mm-dd, interpreted in the visitor's local time
  tagline: string
  meaning: string
  customs: string[]
}

export const DIWALI_DAYS: FestivalDay[] = [
  {
    key: 'dhanteras',
    n: 1,
    name: 'Dhanteras',
    alt: 'Dhanatrayodashi',
    date: '2026-11-06',
    tagline: 'The day of fortune and health',
    meaning:
      'Honours Lakshmi, the goddess of prosperity, and Dhanvantari, the divine physician associated with Ayurveda. It opens the festival with wishes for wealth in the widest sense: health, comfort and good fortune.',
    customs: ['Buying a new utensil or a small piece of gold or silver', 'Cleaning and decorating the home', 'Lighting a lamp at the doorstep at dusk (often called Yama Deepam)'],
  },
  {
    key: 'naraka',
    n: 2,
    name: 'Naraka Chaturdashi',
    alt: 'Choti Diwali · Roop Chaudas',
    date: '2026-11-07',
    tagline: 'Light over darkness',
    meaning:
      'Remembers the victory of Krishna over the demon Narakasura, a story of good overcoming tyranny. In parts of South India this is the main day of Deepavali, begun with a pre-dawn oil bath.',
    customs: ['A ritual oil bath before sunrise', 'Lighting rows of small lamps', 'Rangoli at the entrance and the first sweets of the season'],
  },
  {
    key: 'lakshmi',
    n: 3,
    name: 'Lakshmi Puja',
    alt: 'Diwali · Deepavali',
    date: '2026-11-08',
    tagline: 'The night of a thousand lamps',
    meaning:
      'The main night, on the new-moon (amavasya). Families worship Lakshmi and Ganesha, light diyas in every window and doorway, and share sweets. In Bengal, Odisha and Assam this night is also Kali Puja.',
    customs: ['Lakshmi–Ganesha puja at an auspicious time', 'Diyas, candles and lights in every corner', 'Family gatherings, gifts and sweets'],
  },
  {
    key: 'govardhan',
    n: 4,
    name: 'Govardhan Puja',
    alt: 'Annakut',
    date: '2026-11-09',
    tagline: 'Gratitude and abundance',
    meaning:
      'Recalls Krishna lifting Govardhan hill to shelter his village from a great storm. Devotees offer a "mountain" of food (annakut) in thanks. In Gujarat the new year is celebrated around this time.',
    customs: ['Offering an array of vegetarian dishes as annakut', 'Making a small Govardhan hill from cow dung or clay in some regions', 'Visiting temples and relatives'],
  },
  {
    key: 'bhaidooj',
    n: 5,
    name: 'Bhai Dooj',
    alt: 'Bhau Beej · Bhai Phota',
    date: '2026-11-10',
    tagline: 'The bond of siblings',
    meaning:
      'Celebrates the love between brothers and sisters. Sisters apply a tilak to their brothers’ foreheads and pray for their wellbeing; brothers give gifts in return. Known as Bhai Phota in Bengal.',
    customs: ['Tilak ceremony and aarti', 'A festive meal prepared for the brother', 'Exchanging gifts and blessings'],
  },
]

export interface Tradition {
  key: string
  title: string
  region: string
  front: string
  back: string
}

export const TRADITIONS: Tradition[] = [
  { key: 'ayodhya', title: 'Return of Rama', region: 'North India · Ayodhya', front: 'The lamp-lit homecoming', back: 'Many people link Diwali to the Ramayana: the people of Ayodhya lit lamps to welcome Rama, Sita and Lakshmana home after fourteen years of exile. Ayodhya today holds a large annual lamp-lighting event called Deepotsav.' },
  { key: 'kali', title: 'Kali Puja', region: 'Bengal · Odisha · Assam', front: 'A night of fierce light', back: 'On the new-moon night of Diwali, these regions worship Goddess Kali. Homes and pandals glow with diyas, and the festival is followed a few days later by Bhai Phota.' },
  { key: 'gujarat', title: 'Chopda Pujan', region: 'Gujarat · Western India', front: 'A fresh start for the year', back: 'Traders worship their new account books (chopda) on Diwali, and the Gujarati new year, Bestu Varas, follows. Intricate rangoli and festive snacks fill every home.' },
  { key: 'south', title: 'Deepavali at dawn', region: 'South India', front: 'Oil bath and new clothes', back: 'In Tamil Nadu and neighbouring regions, Deepavali is celebrated on Naraka Chaturdashi. Families rise before sunrise for a ritual oil bath, wear new clothes and share sweets and savouries.' },
  { key: 'sikh', title: 'Bandi Chhor Divas', region: 'Sikh tradition', front: 'The Day of Liberation', back: 'Sikhs remember the release of Guru Hargobind from imprisonment in Gwalior Fort. The Golden Temple in Amritsar is illuminated with thousands of lights.' },
  { key: 'jain', title: 'Jain Diwali', region: 'Jain tradition', front: 'Light of knowledge', back: 'For Jains, Diwali marks the nirvana of Lord Mahavira. Lamps symbolise the light of knowledge that remains after his physical presence.' },
  { key: 'tihar', title: 'Tihar', region: 'Nepal', front: 'Honouring crows, dogs and cows', back: 'Nepal’s five-day Tihar festival honours crows, dogs and cows on successive days, worships Laxmi with lamps, and ends with Bhai Tika, similar to Bhai Dooj.' },
]

export interface QuizQ {
  q: string
  options: string[]
  answer: number
  why: string
}

export const QUIZ: QuizQ[] = [
  { q: 'What does the word “Deepavali” literally mean?', options: ['Festival of colours', 'Row of lamps', 'Night of victory', 'Harvest of light'], answer: 1, why: 'It comes from Sanskrit: deepa (lamp) and avali (row), so “a row of lamps”.' },
  { q: 'Which deities are most commonly worshipped on the main night of Diwali?', options: ['Saraswati and Hanuman', 'Durga and Karthikeya', 'Lakshmi and Ganesha', 'Shiva and Parvati'], answer: 2, why: 'Lakshmi, goddess of prosperity, is invited into the home along with Ganesha, remover of obstacles.' },
  { q: 'Govardhan Puja recalls Krishna doing what?', options: ['Defeating Narakasura', 'Lifting Govardhan hill', 'Crossing the ocean', 'Taming a serpent'], answer: 1, why: 'Krishna lifted Govardhan hill to shelter villagers from a storm, which is why mountains of food (annakut) are offered.' },
  { q: 'What is the purpose of rangoli at the entrance of a home?', options: ['To mark property boundaries', 'To welcome guests and invite good fortune', 'To keep insects away only', 'To record the date of Diwali'], answer: 1, why: 'Rangoli is a decorative welcome, traditionally believed to invite Lakshmi and good luck into the home.' },
  { q: 'Which festival do Sikhs observe around Diwali?', options: ['Hola Mohalla', 'Vaisakhi', 'Bandi Chhor Divas', 'Lohri'], answer: 2, why: 'Bandi Chhor Divas, the “Day of Liberation”, remembers Guru Hargobind’s release from Gwalior Fort.' },
  { q: 'In Bengal, which goddess is worshipped on Diwali night?', options: ['Kali', 'Annapurna', 'Gayatri', 'Sheetala'], answer: 0, why: 'Bengal, Odisha and Assam observe Kali Puja on the new-moon night of Diwali.' },
  { q: 'Bhai Dooj celebrates which relationship?', options: ['Parents and children', 'Teachers and students', 'Husband and wife', 'Brothers and sisters'], answer: 3, why: 'Sisters apply tilak to their brothers and pray for their wellbeing; it is Bhai Phota in Bengal and Bhai Tika in Nepal.' },
  { q: 'Which is a lower-impact way to celebrate Diwali?', options: ['Using clay diyas and natural-colour rangoli', 'Leaving lamps burning unattended', 'Using only plastic decorations', 'Burning waste near lamps'], answer: 0, why: 'Clay diyas and flower or rice-flour rangoli are reusable or biodegradable, and a lit lamp should never be left unattended.' },
]

export const GREEN_TIPS = [
  { icon: 'leaf', title: 'Choose clay diyas', text: 'Terracotta lamps are biodegradable, and buying them supports local potters.' },
  { icon: 'flower', title: 'Colour with nature', text: 'Make rangoli from rice flour, turmeric and flower petals instead of synthetic powders.' },
  { icon: 'bulb', title: 'Mix in LED lights', text: 'LED string lights use little energy and are safer around curtains and children.' },
  { icon: 'wind', title: 'Think before firecrackers', text: 'Crackers add smoke and noise that affect people with asthma, elders, babies and animals. Follow your local rules and consider quieter celebrations.' },
  { icon: 'shield', title: 'Keep lamps safe', text: 'Place diyas on stable, non-flammable surfaces away from curtains, keep water nearby, and never leave flames unattended.' },
  { icon: 'paw', title: 'Look after pets', text: 'Loud noise frightens animals. Keep pets indoors in a quiet room and keep sweets and lamp oil out of reach.' },
]

export const CHECKLIST = [
  { id: 'clean', label: 'Clean and declutter the home' },
  { id: 'rangoli', label: 'Draw a rangoli at the entrance' },
  { id: 'diyas', label: 'Gather diyas, oil or ghee, and wicks' },
  { id: 'flowers', label: 'Arrange fresh flowers and torans' },
  { id: 'puja', label: 'Prepare the puja thali and idols' },
  { id: 'sweets', label: 'Make or buy sweets to share' },
  { id: 'clothes', label: 'Set out new or festive clothes' },
  { id: 'greet', label: 'Send greetings to family and friends' },
  { id: 'safety', label: 'Keep a bucket of water and a first-aid kit handy' },
]

/** Whole local calendar days from `from` to the given ISO date (negative if already past). */
export function daysUntil(iso: string, from = new Date()): number {
  const [y, m, d] = iso.split('-').map(Number)
  const target = new Date(y, m - 1, d)
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
}

export function startOf(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDay(iso: string): string {
  return startOf(iso).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
