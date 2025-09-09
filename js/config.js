// Game Configuration
const CONFIG = {
    // API Configuration
    API_BASE_URL: 'https://gammme-ckakeeeee.vercel.app/',
    
    // Game Constants
    BATTLE_COST: 10,
    INITIAL_STARS: 100,
    CRITICAL_HIT_CHANCE: 0.15,
    CRITICAL_HIT_CHANCE_LOW_HP: 0.3,
    MISS_CHANCE: 0.08,
    SELL_MULTIPLIER: 0.8,
    
    // NFT Templates
    NFT_TEMPLATES: [
        { name: 'Bday candle', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/bdaycandle.gif', tier: 'basic' },
        { name: 'Big Year', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/bigyear.gif', tier: 'basic' },
        { name: 'Durev', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/durev.gif', tier: 'basic' },
        { name: 'Electric Skull', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/electricskull.gif', tier: 'premium' },
        { name: 'Jelly Bean', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/jellybean.gif', tier: 'basic' },
        { name: 'Low Rider', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/lowrider.gif', tier: 'basic' },
        { name: 'Siber', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/siber.gif', tier: 'basic' },
        { name: 'Skull Flower', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/SkullFlower_holders.gif', tier: 'basic' },
        { name: 'Snoop Dog', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/SnoopDogSkins.gif', tier: 'basic' },
        { name: 'Snoops Cigars', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/SnoopsCigars.gif', tier: 'premium' },
        { name: 'Swag Bag', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/Swag_Bag.gif', tier: 'basic' },
        { name: 'Vintage Cigar', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/VintageCigar.gif', tier: 'basic' },
        { name: 'West Side', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/WestSide.gif', tier: 'premium' },
        { name: 'Bday candle 2v', img: 'https://hdptohtdpkothkoefgefsaefefgefgsewef.vercel.app/mygame/imgg/1.gif', tier: 'premium' }
    ],
    
    // NFT Prices (соответствуют порядку в NFT_TEMPLATES)
    NFT_PRICES: [100, 150, 200, 250, 440, 350, 240, 85, 200, 300, 700, 500, 220, 450],
    
    // Battle Animation Timings
    ANIMATION_TIMINGS: {
        PARTICIPANT_ENTRANCE: 2100,
        VS_TEXT_APPEAR: 500,
        HP_BARS_APPEAR: 500,
        NAMES_APPEAR: 500,
        BATTLE_START_DELAY: 500,
        ATTACK_DELAY_MIN: 1500,
        ATTACK_DELAY_MAX: 2500
    },
    
    // Star purchase options
    STAR_PACKAGES: [
        { amount: 50, price: '1.99' },
        { amount: 100, price: '3.99' },
        { amount: 200, price: '6.99' },
        { amount: 500, price: '14.99' },
        { amount: 1000, price: '24.99' },
        { amount: 2000, price: '44.99' },
        { amount: 5000, price: '99.99' }
    ]
};
