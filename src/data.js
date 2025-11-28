// Mock data for destinations and experiences
// Authentic locations focusing on offbeat Himalayan and Northeast Indian destinations

// Import images
import livingRootBridge from './assets/images/living root bridge.jpg'
import songsOfBamboo from './assets/images/songs of bamboo.jpg'
import thukpa from './assets/images/thukpa.jpg'
import aptaniWoman from './assets/images/older aptani woman.jpg'

export const destinations = [
  {
    id: 1,
    name: 'Mechuka',
    location: 'Arunachal Pradesh',
    description: 'A hidden valley where the Siyom River flows through mystical forests. Ancient Memba tribes share stories around bonfires, and prayer flags flutter against snow-capped peaks.',
    image: null,
    rating: 4.9,
    price: 1299,
    category: 'Mountain',
    tags: ['Remote', 'Cultural', 'Adventure'],
    bestTime: 'April - October',
    difficulty: 'Moderate',
  },
  {
    id: 2,
    name: 'Tirthan Valley',
    location: 'Himachal Pradesh',
    description: 'Crystal-clear rivers, apple orchards, and villages untouched by time. Trek through the Great Himalayan National Park and wake up to bird songs in wooden guesthouses.',
    image: null,
    rating: 4.8,
    price: 899,
    category: 'Mountain',
    tags: ['Nature', 'Trekking', 'Wildlife'],
    bestTime: 'March - June, September - November',
    difficulty: 'Easy',
  },
  {
    id: 3,
    name: 'Ziro',
    location: 'Arunachal Pradesh',
    description: 'Rolling rice fields, bamboo groves, and the melodious Apatani tribal culture. Experience traditional face tattoos, organic farming, and the famous Ziro Music Festival.',
    image: null,
    rating: 4.9,
    price: 1099,
    category: 'Cultural',
    tags: ['Music', 'Tribal', 'Sustainable'],
    bestTime: 'March - October',
    difficulty: 'Easy',
  },
  {
    id: 4,
    name: 'Spiti Valley',
    location: 'Himachal Pradesh',
    description: 'The middle land between India and Tibet. Ancient monasteries perched on cliffs, turquoise lakes, and a silence that speaks volumes. Cold desert beauty at its finest.',
    image: null,
    rating: 4.9,
    price: 1499,
    category: 'Adventure',
    tags: ['Buddhism', 'High Altitude', 'Photography'],
    bestTime: 'May - September',
    difficulty: 'Challenging',
  },
  {
    id: 5,
    name: 'Mawlynnong',
    location: 'Meghalaya',
    description: 'Asia\'s cleanest village, where living root bridges span crystal streams. Walk through clouds, taste organic pineapples, and learn sustainable living from the Khasi people.',
    image: null,
    rating: 4.7,
    price: 799,
    category: 'Cultural',
    tags: ['Eco-Tourism', 'Clean', 'Unique'],
    bestTime: 'October - May',
    difficulty: 'Easy',
  },
  {
    id: 6,
    name: 'Chopta',
    location: 'Uttarakhand',
    description: 'The mini Switzerland of India. Meadows carpeted with wildflowers, rhododendron forests, and the sacred Tungnath temple. Trek to Chandrashila for Himalayan sunrises.',
    image: null,
    rating: 4.8,
    price: 699,
    category: 'Mountain',
    tags: ['Trekking', 'Spiritual', 'Camping'],
    bestTime: 'April - November',
    difficulty: 'Moderate',
  },
]

export const experiences = [
  {
    id: 1,
    title: 'Sunrise Trek to Tungnath',
    description: 'Start before dawn, climb through rhododendron forests, and watch the sun paint the Himalayas gold from the world\'s highest Shiva temple.',
    location: 'Chopta, Uttarakhand',
    duration: '2 days',
    groupSize: '4-8 people',
    tags: ['Trekking', 'Spiritual', 'Photography'],
    difficulty: 'Moderate',
    image: null,
    price: 499,
  },
  {
    id: 2,
    title: 'Living with Apatani Tribes',
    description: 'Stay in traditional bamboo houses, learn organic farming techniques, hear ancient folklore, and understand the art of face tattooing from tribal elders.',
    location: 'Ziro, Arunachal Pradesh',
    duration: '4 days',
    groupSize: '2-6 people',
    tags: ['Cultural', 'Tribal', 'Immersive'],
    difficulty: 'Easy',
    image: null,
    price: 899,
  },
  {
    id: 3,
    title: 'Monastery Meditation Retreat',
    description: 'Spend a week in a Spiti monastery. Morning prayers, silent meditation, butter tea with monks, and discussions on Buddhist philosophy under starlit skies.',
    location: 'Spiti Valley, Himachal Pradesh',
    duration: '7 days',
    groupSize: '3-10 people',
    tags: ['Spiritual', 'Meditation', 'Buddhism'],
    difficulty: 'Easy',
    image: null,
    price: 1299,
  },
  {
    id: 4,
    title: 'Trout Fishing & River Stories',
    description: 'Learn traditional fishing from local anglers in pristine Himalayan rivers. Cook your catch by the riverside and swap stories with valley folk.',
    location: 'Tirthan Valley, Himachal Pradesh',
    duration: '3 days',
    groupSize: '2-8 people',
    tags: ['Fishing', 'Nature', 'Local Life'],
    difficulty: 'Easy',
    image: null,
    price: 699,
  },
  {
    id: 5,
    title: 'Living Root Bridge Trek',
    description: 'Trek through misty forests to marvel at 500-year-old bridges grown from living tree roots. Stay with Khasi families and learn rainforest wisdom.',
    location: 'Mawlynnong, Meghalaya',
    duration: '3 days',
    groupSize: '4-12 people',
    tags: ['Trekking', 'Eco-Tourism', 'Photography'],
    difficulty: 'Moderate',
    image: null,
    price: 799,
  },
  {
    id: 6,
    title: 'Mechuka Valley Exploration',
    description: 'Journey to India\'s last frontier. Cross suspension bridges, visit Samten Yongcha monastery, and share meals with Memba families in wooden homes.',
    location: 'Mechuka, Arunachal Pradesh',
    duration: '5 days',
    groupSize: '4-8 people',
    tags: ['Remote', 'Adventure', 'Cultural'],
    difficulty: 'Moderate',
    image: null,
    price: 1499,
  },
]

export const culturalStories = [
  {
    id: 1,
    title: 'The Art of Living Roots',
    category: 'Art & Craft',
    description: 'For centuries, the Khasi people of Meghalaya have practiced bio-engineering before it had a name. They guide the aerial roots of rubber trees across rivers, weaving them into living bridges that grow stronger with time. It takes 15 years to create a bridge, and they last for 500. This is patience as art, nature as architecture.',
    location: 'Meghalaya',
    image: livingRootBridge,
    icon: '🌿',
    fullStory: 'Deep in the rainforests of Meghalaya, where clouds descend to kiss the earth and rivers rage during monsoons, the Khasi people discovered something remarkable: patience has its own magic. Instead of building bridges from dead wood and stone that would rot and crumble in the relentless humidity, they learned to collaborate with the living forest itself.\n\nThe process begins with a young Ficus elastica tree planted on each bank of a river. Over decades, village elders guide the aerial roots across bamboo scaffolding, training them to reach toward each other. Children who help plant these roots know they may never walk across the finished bridge—that honor belongs to their grandchildren. The roots intertwine, thicken, and eventually fuse into a living structure that can hold fifty people at once.\n\nToday, some bridges are over 500 years old, growing stronger each year as new roots join the matrix. During the monsoon, when modern steel bridges wash away, these living bridges stand firm, their roots gripping both banks like the hands of ancestors refusing to let go. This isn\'t just engineering—it\'s a philosophy. Build with nature, not against it. Think in generations, not quarters. Create beauty that outlives you.\n\nThe Double Decker Root Bridge in Nongriat village has become a pilgrimage site for those seeking to understand what sustainable really means. The 3,000-step descent through mist-laden forests leads to a revelation: the future doesn\'t have to look like concrete and steel. It can be green, growing, and alive.'
  },
  {
    id: 2,
    title: 'Songs in the Bamboo Wind',
    category: 'Music & Dance',
    description: 'In Ziro Valley, Apatani women preserve songs passed down through generations. During the Myoko festival, entire villages become orchestras of voices, bamboo flutes, and drum rhythms. Each song tells of harvest, love, or ancestors. Music here isn\'t performance—it\'s memory made audible.',
    location: 'Arunachal Pradesh',
    image: songsOfBamboo,
    icon: '🎵',
    fullStory: 'In Ziro Valley, where terraced rice fields cascade down hillsides like green staircases, music isn\'t entertainment—it\'s the fabric that holds society together. The Apatani people have no written language for their ancient songs. Every melody, every rhythm, every verse exists only in human memory, passed from grandmother to granddaughter in an unbroken chain stretching back centuries.\n\nDuring the Myoko festival in March, the valley transforms into a living concert hall. Women in traditional dress, their faces bearing the distinctive tattoos of the older generation, gather in circles. They sing songs of the millet harvest, of courtship beside the river, of ancestors who cleared these forests. The melodies are pentatonic, haunting, unlike anything you\'ve heard on Spotify. Young girls watch closely, memorizing not just the notes but the way an elder tilts her head at a particular phrase, the hand gestures that punctuate the rhythm.\n\nThe bamboo flute—called piri—carries melodies that mimic birdsong and flowing water. Men play them while working in the fields, a soundtrack to daily life. During festivals, drum circles form spontaneously. The rhythm starts slow, mimicking a heartbeat, then accelerates until the whole village seems to pulse as one organism.\n\nBut there\'s urgency beneath the beauty. Younger Apatanis move to cities, where Bollywood and K-pop dominate. The number of people who know the complete verses of ancient songs shrinks each year. That\'s why organizations are now recording these songs, creating digital archives. Yet everyone knows: a recording captures sound, not soul. Real preservation happens when a teenager decides to sit with their grandmother and learn, when memory passes from breath to breath, generation to generation.\n\nDuring the Ziro Music Festival each September, indie bands from around the world perform against the backdrop of these rice terraces. It\'s a beautiful collision—electric guitars and traditional bamboo flutes, folk songs and contemporary poetry. The message is clear: tradition doesn\'t mean stagnation. Culture is a river, not a museum.'
  },
  {
    id: 3,
    title: 'Himalayan Soul Food',
    category: 'Cuisine',
    description: 'Thukpa steaming in wooden bowls. Churpi cheese aged for months. Tongba—millet beer sipped through bamboo straws. Himalayan cuisine is survival turned delicious, every dish a response to altitude and seasons. Local grandmothers still know which wild herbs heal, which mushrooms sustain.',
    location: 'Spiti & Sikkim',
    image: thukpa,
    icon: '🍜',
    fullStory: 'High in the Himalayas, where oxygen is thin and winters are merciless, cuisine isn\'t about Michelin stars—it\'s about survival. Yet somewhere between necessity and tradition, mountain communities created food that nourishes both body and soul.\n\nThukpa, the hearty noodle soup found across Tibetan Buddhist regions, is breakfast, lunch, and dinner in high-altitude villages. But each family\'s recipe is different. Some use hand-pulled noodles thick as rope. Others add wild mushrooms foraged from mountain forests. The broth simmers for hours, bones releasing minerals that help combat altitude sickness. Served steaming in wooden bowls, it\'s the first thing offered to guests—hospitality in liquid form.\n\nChurti, the hard cheese carved from yak milk and aged for months, tastes like concentrated sunshine. Nomadic herders carry it on long journeys, chewing small pieces for quick energy. Children grow up gnawing on churti like candy, their teeth strong from the calcium, their bones dense enough to handle the rigors of mountain life.\n\nTongba is where science meets ceremony. Fermented millet is packed into a bamboo container, then hot water is poured over it and drunk through a bamboo straw. The first sip tastes mildly alcoholic and pleasantly sour. But you keep adding water, and each pour releases new flavors—the drink evolving over hours, like good conversation. Share tongba with strangers, and they become friends by the time the vessel runs dry.\n\nThe real magic lies in the wild herbs. Grandmothers in Spiti villages can identify dozens of mountain plants by smell alone—which cures altitude headaches, which settles nervous stomachs, which brings warmth to cold limbs. This knowledge isn\'t written in books. It\'s remembered in recipes, passed down while cooking together, encoded in the muscle memory of hands that know exactly how much jimbu to add to a dal.\n\nModern restaurants in Delhi and Mumbai now serve "Himalayan cuisine," but something essential gets lost in translation. Real Himalayan food tastes like the place it comes from—wind, snow, resilience. It tastes like home when you\'re 4,000 meters from the nearest city, when the temperature drops below freezing, when a bowl of hot thukpa is the difference between comfort and despair.'
  },
  {
    id: 4,
    title: 'Faces That Tell Stories',
    category: 'People & Traditions',
    description: 'Older Apatani women wear facial tattoos—blue lines etched in youth as symbols of beauty and identity. Though the practice has ended, these living archives walk among rice terraces, each line a chapter of tribal history. To meet them is to touch a vanishing world.',
    location: 'Ziro Valley',
    image: aptaniWoman,
    icon: '👵',
    fullStory: 'Look into the face of an elderly Apatani woman in Ziro Valley, and you\'re looking at a living museum. The vertical blue lines tattooed from forehead to chin, the geometric patterns on her nose—these aren\'t decorations. They\'re documents. They\'re defiance. They\'re beauty defined on their own terms.\n\nThe practice began centuries ago, according to oral histories. Apatani women were so beautiful that neighboring tribes would raid villages to kidnap them. So the women began tattooing their faces and inserting large nose plugs, making themselves "less attractive" to outsiders while signaling sophistication within their own community. What started as protection became identity. The tattoos marked you as Apatani, as initiated, as connected to ancestral traditions.\n\nThe tattooing happened around age 12-15, performed by elder women using thorns and soot. It was excruciatingly painful. It was also a rite of passage. Girls endured it to become women, to join the lineage of their mothers and grandmothers. The patterns weren\'t arbitrary—certain designs denoted certain clans. A trained eye could read a woman\'s entire family history in the lines on her face.\n\nBut in the 1970s, the Indian government banned the practice as "primitive." Missionary schools taught young Apatanis to be ashamed of their traditions. The last generation of tattooed women are now in their 70s and 80s. They walk through rice terraces in traditional dress, their faces living testimony to a world that\'s vanishing.\n\nWhen you meet them, they\'re gracious but cautious. Tourists often treat them like exhibits, snapping photos without permission. But sit with them, share a cup of tea, ask genuine questions—and they open up. They talk about how the tattoos connect them to their grandmothers\' grandmothers. How they feel proud, not ashamed. How beauty isn\'t universal—it\'s cultural, chosen, profound.\n\nYoung Apatani women today dress in jeans and T-shirts, study engineering in Delhi, work in Bangalore\'s tech parks. Most won\'t tattoo their faces. But they\'re reclaiming the tradition in other ways—wearing traditional jewelry to work, researching their history, teaching their children Apatani language and songs. The face tattoos may disappear, but the spirit behind them—the courage to define beauty on your own terms—that endures.'
  },
]

export const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'Spiti changed how I see travel. It\'s not about ticking boxes—it\'s about sitting with monks, breathing thin air, and feeling small under vast skies.',
    rating: 5,
    trip: 'Monastery Retreat, Spiti',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    location: 'Bangalore',
    text: 'Staying with the Apatani families in Ziro wasn\'t tourism—it was belonging. I learned to farm, to listen, to slow down.',
    rating: 5,
    trip: 'Tribal Immersion, Ziro',
  },
  {
    id: 3,
    name: 'Neha Kapoor',
    location: 'Delhi',
    text: 'Tirthan Valley was pure magic. Fishing at dawn, cooking by the river, sleeping to the sound of water. This is travel that heals.',
    rating: 5,
    trip: 'River Experience, Tirthan',
  },
]

export const homePageCopy = {
  hero: {
    tagline: 'Travel. Connect. Belong.',
    subtitle: 'Where ancient trails meet modern souls. Discover offbeat destinations, live with local communities, and find where you truly belong.',
    cta: 'Explore Offbeat Trails',
  },
  intro: {
    title: 'Not All Who Wander Are Lost',
    text: 'Some of us are searching. For quiet mountains, for warm hearths, for stories passed down through generations. For places where travel isn\'t about seeing—it\'s about being.',
  },
  destinations: {
    title: 'Offbeat Destinations',
    subtitle: 'Hidden valleys. Ancient villages. Trails less traveled.',
  },
  experiences: {
    title: 'Local Experiences',
    subtitle: 'Live with tribes. Learn from elders. Listen to the land.',
  },
  cultural: {
    title: 'Stories from the Road',
    subtitle: 'Art, music, food, and people. This is culture, alive.',
  },
  cta: {
    title: 'Your Journey Begins Here',
    subtitle: 'Pack light. Stay curious. Leave gently.',
  },
}

export default {
  destinations,
  experiences,
  culturalStories,
  testimonials,
  homePageCopy,
}
