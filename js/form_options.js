// global values for user selection in form

const timeOptions = [
    {name: "30 minutes", value: 1800},
    {name: "1 hour", value: 3600},
    {name: "2 hours", value: 7200},
    {name: "3 hours", value: 10800},
]

const genreOptions = [
    {name: "electronic", value: "electronic"},
    {name: "classical", value: "classical"},
    {name: "old-school", value: "old-school"},
    {name: "jazz", value: "jazz"},
    {name: "rock", value: "rock"},
]

const styleOptions = [
    {name: "instrumental", value: "instrumental"},
    {name: "vocal", value: "vocal"},
    {name: "ambient", value: "ambient"},
]

const tagOptions = [
    {genre: "electronic", tags: [
        {name: "house", value: "house"},
        {name: "deep house", value: "deep-house"},
        {name: "progressive house", value: "progressive-house"},
        {name: "drum & bass", value: "drum-bass"},
        {name: "techno", value: "techno"},
        {name: "chillout", value: "chillout"},
        {name: "downtempo", value: "downtempo"},
        {name: "trance", value: "trance"},
        {name: "psychedelic", value: "psychedelic"},
    ]},

    {genre: "classical", tags: [
        {name: "modern classical", value: "modern-classical"},
        {name: "contemporary", value: "contemporary"},
        {name: "orchestral", value: "orchestral"},
        {name: "symphony", value: "symphony"},
        {name: "baroque", value: "baroque"},
        {name: "experimental", value: "experimental"},
    ]},

    {genre: "old-school", tags: [
        {name: "funk", value: "funk"},
        {name: "disco", value: "disco"},
        {name: "soul", value: "soul"},
        {name: "reggae", value: "reggae"},
        {name: "hip hop", value: "hip-hop"},
    ]},

    {genre: "jazz", tags: [
        {name: "blues", value: "blues"},
        {name: "smooth jazz", value: "smooth-jazz"},
        {name: "lounge", value: "lounge"},
        {name: "nu jazz", value: "nu-jazz"},
    ]},

    {genre: "rock", tags: [
        {name: "classic rock", value: "classic-rock"},
        {name: "folk", value: "folk"},
        {name: "metal", value: "metal"},
        {name: "punk", value: "punk"},
        {name: "psychedelic", value: "psychedelic"},
    ]}
]
