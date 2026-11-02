import type { Lang, Length, Relationship, Tone } from './types'

export interface WishInput {
  sender: string
  recipient: string
  relationship: Relationship
  lang: Lang
  tone: Tone
  length: Length
}

export const LANGS: { key: Lang; label: string; native: string }[] = [
  { key: 'en', label: 'English', native: 'English' },
  { key: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { key: 'bn', label: 'Bengali', native: 'বাংলা' },
]

export const TONES: { key: Tone; label: string }[] = [
  { key: 'emotional', label: 'Emotional' },
  { key: 'heartwarming', label: 'Heartwarming' },
  { key: 'professional', label: 'Professional' },
  { key: 'friendly', label: 'Friendly' },
  { key: 'inspirational', label: 'Inspirational' },
  { key: 'traditional', label: 'Traditional' },
]

export const RELATIONSHIPS: { key: Relationship; label: string }[] = [
  { key: 'family', label: 'Family' },
  { key: 'friend', label: 'Friend' },
  { key: 'partner', label: 'Partner' },
  { key: 'colleague', label: 'Colleague' },
  { key: 'mentor', label: 'Teacher / Mentor' },
  { key: 'client', label: 'Client / Boss' },
]

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(arr: T[], rnd: () => number, n: number): T[] {
  const pool = [...arr]
  const out: T[] = []
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0])
  return out
}

const FORMAL: Relationship[] = ['colleague', 'mentor', 'client']

interface Pack {
  greeting: (name: string, rel: Relationship) => string
  /** Pronoun-aware body lines. `f` = true when addressing formally. */
  body: Record<Tone, (f: boolean) => string[]>
  closing: Record<Tone, string[]>
  relation: Record<Relationship, (f: boolean) => string>
  sign: (sender: string) => string
  opener: string
}

/* ------------------------------ English ------------------------------ */
const en: Pack = {
  opener: 'Happy Diwali!',
  greeting: (n) => (n ? `Dear ${n},` : 'Dear friend,'),
  body: {
    emotional: () => [
      'As the diyas glow tonight, my heart fills with gratitude for the light you have brought into my life.',
      'Some people are like a diya in the dark: quiet, warm and impossible to forget. You are one of them.',
      'On this night of lights, I hold you in my thoughts and wish your heart the peace it deserves.',
      'May every flame that is lit tonight carry a little of my love and thanks to you.',
    ],
    heartwarming: () => [
      'May your home be filled with laughter, the sweetness of mithai and the glow of a thousand little lights.',
      'Wishing you a Diwali full of warm hugs, familiar faces and moments that stay in the heart for years.',
      'May the festival fill every corner of your home with joy, and every day ahead with small happy surprises.',
      'May this season remind you how loved you are, today and always.',
    ],
    professional: () => [
      'I wish you a joyful and prosperous Diwali, and a year ahead rich in good health and meaningful success.',
      'May this festival of lights bring clarity to your goals and renewed energy to everything you pursue.',
      'Thank you for the trust and collaboration this year. I look forward to achieving more together.',
      'May the coming year bring you new opportunities, steady growth and well-earned rewards.',
    ],
    friendly: () => [
      'Hope your Diwali is packed with great food, bright lights and zero stress!',
      'Let’s make this festival one for the memory books: lots of laughter, sweets and sparkle.',
      'Eat too many sweets, light too many diyas and enjoy every second of it.',
      'Can’t wait to celebrate with you. Save me a laddoo!',
    ],
    inspirational: () => [
      'Just as one small diya can brighten a whole room, one kind act can light up someone’s day. Keep shining.',
      'Let this Diwali remind us that light always finds a way through the dark. So will you.',
      'May you find the courage to chase big dreams and the patience to let them bloom.',
      'Your light matters. Let it guide you toward everything you are meant to become.',
    ],
    traditional: () => [
      'May Goddess Lakshmi bless your home with prosperity and Lord Ganesha remove every obstacle from your path.',
      'May the victory of light over darkness and good over evil bring peace and happiness to your family.',
      'On this auspicious occasion, may the divine light illuminate your life with health, wealth and wisdom.',
      'Wishing you and your loved ones a Diwali blessed with devotion, harmony and abundance.',
    ],
  },
  closing: {
    emotional: ['Thank you for being you.', 'You are always in my heart.'],
    heartwarming: ['Sending you all my love this festive season.', 'Celebrate beautifully!'],
    professional: ['With warm regards and best wishes,', 'Wishing you and your team a wonderful festival.'],
    friendly: ['Have an amazing Diwali!', 'Let’s catch up soon!'],
    inspirational: ['Keep shining, always.', 'Here’s to brighter days ahead.'],
    traditional: ['Shubh Deepavali!', 'May divine blessings always be with you.'],
  },
  relation: {
    family: () => 'Family makes every celebration complete, and I am so grateful for ours.',
    friend: () => 'Thank you for being the kind of friend who makes every festival brighter.',
    partner: () => 'Every light I light tonight is a reminder of how lucky I am to have you.',
    colleague: () => 'It is a pleasure to work alongside you, and I value your support.',
    mentor: () => 'Thank you for your guidance. It has lit my path in more ways than you may know.',
    client: () => 'We truly value your partnership and look forward to continuing it.',
  },
  sign: (s) => (s ? `Warm wishes,\n${s}` : 'Warm wishes'),
}

/* ------------------------------ Hindi ------------------------------ */
// Formal = आप, informal = तुम. Gendered possessives are chosen per noun below.
const hi: Pack = {
  opener: 'दीपावली की हार्दिक शुभकामनाएँ!',
  greeting: (n, rel) => (n ? (FORMAL.includes(rel) ? `आदरणीय ${n} जी,` : `प्रिय ${n},`) : 'प्रिय मित्र,'),
  body: {
    emotional: (f) => [
      `आज जब दीप जगमगा रहे हैं, ${f ? 'आपके' : 'तुम्हारे'} प्रति मेरा मन कृतज्ञता से भर उठता है।`,
      `कुछ लोग अँधेरे में जलते दीये जैसे होते हैं: शांत, गरमाहट भरे और कभी न भुलाए जाने वाले। ${f ? 'आप उन्हीं में से एक हैं' : 'तुम उन्हीं में से एक हो'}।`,
      `इस प्रकाश-पर्व पर ${f ? 'आपके' : 'तुम्हारे'} लिए मन की शांति की मेरी हार्दिक कामना है।`,
      `आज जलने वाला हर दीप मेरा स्नेह और धन्यवाद ${f ? 'आप' : 'तुम'} तक पहुँचाए।`,
    ],
    heartwarming: (f) => [
      `${f ? 'आपके' : 'तुम्हारे'} घर में हँसी, मिठाइयों की मिठास और असंख्य दीपों की रोशनी बनी रहे।`,
      'यह दीपावली अपनों के साथ, ढेर सारी यादों और खुशियों से भरी हो।',
      `यह त्योहार ${f ? 'आपके' : 'तुम्हारे'} घर के हर कोने में खुशियाँ भर दे और आने वाले हर दिन को सुंदर बना दे।`,
      `यह पर्व ${f ? 'आपको' : 'तुम्हें'} याद दिलाए कि ${f ? 'आप हमारे लिए कितने खास हैं' : 'तुम हमारे लिए कितने खास हो'}।`,
    ],
    professional: (f) => [
      `${f ? 'आपको' : 'तुम्हें'} दीपावली की हार्दिक शुभकामनाएँ। आने वाला वर्ष अच्छे स्वास्थ्य और सार्थक सफलता से भरा रहे।`,
      `प्रकाश का यह पर्व ${f ? 'आपके' : 'तुम्हारे'} लक्ष्यों को स्पष्टता और हर प्रयास को नई ऊर्जा दे।`,
      'इस वर्ष के सहयोग और विश्वास के लिए धन्यवाद। हम आगे भी मिलकर और बेहतर करेंगे।',
      'आने वाला वर्ष नए अवसर, निरंतर प्रगति और परिश्रम का उचित फल लेकर आए।',
    ],
    friendly: (f) => [
      `उम्मीद है ${f ? 'आपकी' : 'तुम्हारी'} दिवाली लज़ीज़ खाने, जगमगाती रोशनी और बिना किसी टेंशन के बीतेगी!`,
      `${f ? 'चलिए' : 'चलो'} इस त्योहार को यादगार बनाते हैं: खूब हँसी, मिठाई और रौनक के साथ।`,
      f ? 'मिठाइयाँ जी भरकर खाइए, दीये जलाइए और हर पल का मज़ा लीजिए।' : 'मिठाइयाँ जी भरकर खाओ, दीये जलाओ और हर पल का मज़ा लो।',
      `साथ में त्योहार मनाने का इंतज़ार है। मेरे लिए एक लड्डू ${f ? 'बचा कर रखिएगा' : 'बचा कर रखना'}!`,
    ],
    inspirational: (f) => [
      `जैसे एक छोटा-सा दीया पूरे कमरे को रोशन कर देता है, वैसे ही एक अच्छा काम किसी का दिन रोशन कर सकता है। ${f ? 'आप यूँ ही चमकते रहें' : 'तुम यूँ ही चमकते रहो'}।`,
      `यह दिवाली याद दिलाए कि उजाला अँधेरे में भी रास्ता खोज लेता है, और ${f ? 'आप भी खोज लेंगे' : 'तुम भी खोज लोगे'}।`,
      `${f ? 'आपमें' : 'तुममें'} बड़े सपनों का पीछा करने का साहस और उन्हें खिलने देने का धैर्य बना रहे।`,
      `${f ? 'आपकी' : 'तुम्हारी'} रोशनी बहुत मायने रखती है। यही रोशनी ${f ? 'आपको' : 'तुम्हें'} हर मंज़िल तक ले जाए।`,
    ],
    traditional: (f) => [
      `माँ लक्ष्मी ${f ? 'आपके' : 'तुम्हारे'} घर को सुख-समृद्धि से भर दें और श्री गणेश हर बाधा दूर करें।`,
      `अंधकार पर प्रकाश और बुराई पर अच्छाई की जीत ${f ? 'आपके' : 'तुम्हारे'} परिवार में शांति और खुशहाली लाए।`,
      `इस शुभ अवसर पर दिव्य ज्योति ${f ? 'आपके' : 'तुम्हारे'} जीवन को स्वास्थ्य, धन और ज्ञान से आलोकित करे।`,
      `${f ? 'आपको' : 'तुम्हें'} और ${f ? 'आपके' : 'तुम्हारे'} प्रियजनों को भक्ति, सद्भाव और समृद्धि से भरी दीपावली मिले।`,
    ],
  },
  closing: {
    emotional: ['मेरे जीवन में होने के लिए धन्यवाद।', 'आप सदा मेरे दिल में हैं।'],
    heartwarming: ['इस त्योहार पर ढेर सारा प्यार।', 'खूब धूमधाम से मनाइए!'],
    professional: ['सादर शुभकामनाओं सहित।', 'आपको और आपकी टीम को पर्व की मंगलकामनाएँ।'],
    friendly: ['दिवाली खूब मज़ेदार रहे!', 'जल्दी मिलते हैं!'],
    inspirational: ['यूँ ही जगमगाते रहिए।', 'आगे के दिन और उजले हों।'],
    traditional: ['शुभ दीपावली!', 'ईश्वर की कृपा सदा बनी रहे।'],
  },
  relation: {
    family: () => 'परिवार के साथ ही हर उत्सव पूरा होता है, और अपने परिवार के लिए मन में बहुत आभार है।',
    friend: () => 'ऐसे दोस्त होने के लिए शुक्रिया जो हर त्योहार को और रोशन कर देते हैं।',
    partner: () => 'आज जलने वाला हर दीप याद दिलाता है कि तुम मेरे जीवन में हो, यही मेरा सौभाग्य है।',
    colleague: () => 'आपके साथ काम करना सुखद अनुभव है और आपके सहयोग के लिए मन में बहुत सम्मान है।',
    mentor: () => 'आपके मार्गदर्शन के लिए धन्यवाद। उसने मेरी राह को जितना रोशन किया है, उतना शायद आप भी नहीं जानते।',
    client: () => 'हम आपके सहयोग को बहुत महत्व देते हैं और इसे आगे भी जारी रखना चाहते हैं।',
  },
  sign: (s) => (s ? `शुभकामनाओं सहित,\n${s}` : 'शुभकामनाओं सहित'),
}

/* ------------------------------ Bengali ------------------------------ */
const bn: Pack = {
  opener: 'শুভ দীপাবলি!',
  greeting: (n, rel) => (n ? (FORMAL.includes(rel) ? `শ্রদ্ধেয় ${n},` : `প্রিয় ${n},`) : 'প্রিয় বন্ধু,'),
  body: {
    emotional: (f) => [
      `আজ যখন প্রদীপগুলো জ্বলে উঠছে, ${f ? 'আপনার' : 'তোমার'} প্রতি কৃতজ্ঞতায় আমার মন ভরে যাচ্ছে।`,
      `কিছু মানুষ অন্ধকারে জ্বলা প্রদীপের মতো: শান্ত, উষ্ণ আর অবিস্মরণীয়। ${f ? 'আপনি' : 'তুমি'} তাদেরই একজন।`,
      `এই আলোর উৎসবে আমি ${f ? 'আপনাকে' : 'তোমাকে'} মনে রেখে মনের শান্তি কামনা করি।`,
      `আজ যে প্রদীপই জ্বলুক, তা আমার ভালোবাসা আর ধন্যবাদ ${f ? 'আপনার' : 'তোমার'} কাছে পৌঁছে দিক।`,
    ],
    heartwarming: (f) => [
      `${f ? 'আপনার' : 'তোমার'} ঘর হাসি, মিষ্টির মিষ্টতা আর অসংখ্য প্রদীপের আলোয় ভরে উঠুক।`,
      'এই দীপাবলি কাটুক প্রিয়জনদের সঙ্গে, অনেক স্মৃতি আর আনন্দে।',
      `এই উৎসব ${f ? 'আপনার' : 'তোমার'} ঘরের প্রতিটি কোণ আনন্দে ভরে দিক, আর আগামী প্রতিটি দিন হোক সুন্দর।`,
      `এই উৎসব মনে করিয়ে দিক ${f ? 'আপনি' : 'তুমি'} কতটা প্রিয় আর কতটা আপন।`,
    ],
    professional: (f) => [
      `${f ? 'আপনাকে' : 'তোমাকে'} দীপাবলির আন্তরিক শুভেচ্ছা। আগামী বছর সুস্বাস্থ্য ও অর্থবহ সাফল্যে ভরে উঠুক।`,
      `আলোর এই উৎসব ${f ? 'আপনার' : 'তোমার'} লক্ষ্যে স্পষ্টতা আর প্রতিটি কাজে নতুন উদ্যম এনে দিক।`,
      'এ বছরের সহযোগিতা ও আস্থার জন্য ধন্যবাদ। আমরা একসঙ্গে আরও ভালো কিছু করব, এই আশা রাখি।',
      'আগামী বছর নতুন সুযোগ, ধারাবাহিক অগ্রগতি আর পরিশ্রমের যোগ্য ফল বয়ে আনুক।',
    ],
    friendly: (f) => [
      `আশা করি ${f ? 'আপনার' : 'তোমার'} দীপাবলি কাটবে দারুণ খাবার, ঝলমলে আলো আর একদম টেনশনহীন!`,
      `${f ? 'চলুন' : 'চলো'} এই উৎসবটা স্মরণীয় করে তুলি: প্রচুর হাসি, মিষ্টি আর আলোর ঝলকানি নিয়ে।`,
      f ? 'মন ভরে মিষ্টি খান, প্রদীপ জ্বালান আর প্রতিটি মুহূর্ত উপভোগ করুন।' : 'মন ভরে মিষ্টি খাও, প্রদীপ জ্বালাও আর প্রতিটি মুহূর্ত উপভোগ করো।',
      `একসঙ্গে উৎসব করার অপেক্ষায় আছি। আমার জন্য একটা মিষ্টি ${f ? 'রাখবেন' : 'রেখো'}!`,
    ],
    inspirational: (f) => [
      `একটা ছোট্ট প্রদীপ যেমন পুরো ঘর আলোকিত করে, একটা ভালো কাজও তেমনি কারও দিন আলোকিত করতে পারে। ${f ? 'আপনি এভাবেই জ্বলতে থাকুন' : 'তুমি এভাবেই জ্বলতে থেকো'}।`,
      `এই দীপাবলি মনে করিয়ে দিক, আলো অন্ধকারেও পথ খুঁজে নেয়, ${f ? 'আপনিও নেবেন' : 'তুমিও নেবে'}।`,
      `বড় স্বপ্নের পিছনে ছোটার সাহস আর তাকে ফুটতে দেওয়ার ধৈর্য ${f ? 'আপনার' : 'তোমার'} থাকুক।`,
      `${f ? 'আপনার' : 'তোমার'} আলোর মূল্য অনেক। সেই আলোই ${f ? 'আপনাকে' : 'তোমাকে'} প্রতিটি গন্তব্যে পৌঁছে দিক।`,
    ],
    traditional: (f) => [
      `মা লক্ষ্মী ${f ? 'আপনার' : 'তোমার'} গৃহে সুখ ও সমৃদ্ধি দান করুন, আর গণেশ দেব সব বাধা দূর করুন।`,
      `অন্ধকারের ওপর আলোর, অশুভের ওপর শুভর জয় ${f ? 'আপনার' : 'তোমার'} পরিবারে শান্তি ও আনন্দ বয়ে আনুক।`,
      `এই শুভ লগ্নে দিব্য জ্যোতি ${f ? 'আপনার' : 'তোমার'} জীবনকে স্বাস্থ্য, ঐশ্বর্য ও জ্ঞানে আলোকিত করুক।`,
      `${f ? 'আপনার' : 'তোমার'} ও প্রিয়জনদের দীপাবলি হোক ভক্তি, সম্প্রীতি ও প্রাচুর্যে ভরা।`,
    ],
  },
  closing: {
    emotional: ['আমার জীবনে থাকার জন্য ধন্যবাদ।', 'আপনি সবসময় আমার মনে আছেন।'],
    heartwarming: ['এই উৎসবে অনেক ভালোবাসা রইল।', 'দারুণ আনন্দে কাটুক!'],
    professional: ['আন্তরিক শুভেচ্ছাসহ।', 'আপনাকে ও আপনার দলকে উৎসবের শুভকামনা।'],
    friendly: ['দারুণ কাটুক দীপাবলি!', 'শিগগিরই দেখা হচ্ছে!'],
    inspirational: ['এভাবেই আলো ছড়াতে থাকুন।', 'আগামী দিনগুলো আরও উজ্জ্বল হোক।'],
    traditional: ['শুভ দীপাবলি!', 'ঈশ্বরের আশীর্বাদ সর্বদা থাকুক।'],
  },
  relation: {
    family: () => 'পরিবারের সঙ্গেই প্রতিটি উৎসব সম্পূর্ণ হয়, আর আমি আমাদের পরিবারের জন্য কৃতজ্ঞ।',
    friend: () => 'এমন বন্ধু হওয়ার জন্য ধন্যবাদ, যে প্রতিটি উৎসবকে আরও উজ্জ্বল করে তোলে।',
    partner: () => 'আজ যে প্রদীপই জ্বালি, মনে পড়ে তুমি আমার জীবনে আছ, এটাই আমার সৌভাগ্য।',
    colleague: () => 'আপনার সঙ্গে কাজ করা আনন্দের, আর আপনার সহযোগিতাকে আমি মূল্য দিই।',
    mentor: () => 'আপনার দিকনির্দেশনার জন্য ধন্যবাদ। তা আমার পথ যতটা আলোকিত করেছে, হয়তো আপনিও জানেন না।',
    client: () => 'আমরা আপনার সঙ্গে অংশীদারিত্বকে অত্যন্ত মূল্য দিই এবং তা চালিয়ে যেতে আগ্রহী।',
  },
  sign: (s) => (s ? `শুভেচ্ছান্তে,\n${s}` : 'শুভেচ্ছান্তে'),
}

const PACKS: Record<Lang, Pack> = { en, hi, bn }

/**
 * Offline, template-based generator. `variation` changes the selection so
 * "Regenerate" gives a different greeting for identical inputs.
 */
export function generateOffline(input: WishInput, variation = 0): string {
  const pack = PACKS[input.lang]
  const formal = FORMAL.includes(input.relationship)
  const rnd = mulberry32(hash(JSON.stringify(input)) + variation * 7919)
  const bodies = pack.body[input.tone](formal)
  const nBody = input.length === 'short' ? 1 : input.length === 'medium' ? 2 : 3
  const lines = pick(bodies, rnd, nBody)
  const closing = pick(pack.closing[input.tone], rnd, 1)[0]

  const parts: string[] = [pack.greeting(input.recipient.trim(), input.relationship), '', pack.opener]
  parts.push(lines.join(' '))
  if (input.length === 'long') parts.push(pack.relation[input.relationship](formal))
  if (input.length !== 'short') parts.push(closing)
  parts.push('', pack.sign(input.sender.trim()))
  return parts.join('\n').replace(/\n{3,}/g, '\n\n')
}
