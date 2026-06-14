// Keyed by "title lowercase|artist lowercase" — applies to all copies of an album
export const TRACKLISTS = {

  // ── Pink Floyd ──────────────────────────────────────────────────────
  'the dark side of the moon|pink floyd': [
    { side: 'A', title: 'Speak to Me / Breathe',     duration: '3:58' },
    { side: 'A', title: 'On the Run',                 duration: '3:30' },
    { side: 'A', title: 'Time',                       duration: '7:04' },
    { side: 'A', title: 'The Great Gig in the Sky',  duration: '4:44' },
    { side: 'B', title: 'Money',                      duration: '6:22' },
    { side: 'B', title: 'Us and Them',                duration: '7:51' },
    { side: 'B', title: 'Any Colour You Like',        duration: '3:26' },
    { side: 'B', title: 'Brain Damage',               duration: '3:46' },
    { side: 'B', title: 'Eclipse',                    duration: '2:03' },
  ],
  'wish you were here|pink floyd': [
    { side: 'A', title: 'Shine On You Crazy Diamond (Parts I–V)', duration: '13:31' },
    { side: 'A', title: 'Welcome to the Machine',                  duration: '7:31'  },
    { side: 'B', title: 'Have a Cigar',                            duration: '5:08'  },
    { side: 'B', title: 'Wish You Were Here',                      duration: '5:40'  },
    { side: 'B', title: 'Shine On You Crazy Diamond (Parts VI–IX)', duration: '12:29'},
  ],

  // ── Led Zeppelin ────────────────────────────────────────────────────
  'led zeppelin iv|led zeppelin': [
    { side: 'A', title: 'Black Dog',               duration: '4:54' },
    { side: 'A', title: 'Rock and Roll',            duration: '3:40' },
    { side: 'A', title: 'The Battle of Evermore',  duration: '5:51' },
    { side: 'A', title: 'Stairway to Heaven',      duration: '8:02' },
    { side: 'B', title: 'Misty Mountain Hop',      duration: '4:38' },
    { side: 'B', title: 'Four Sticks',             duration: '4:44' },
    { side: 'B', title: 'Going to California',     duration: '3:31' },
    { side: 'B', title: 'When the Levee Breaks',   duration: '7:08' },
  ],
  'physical graffiti|led zeppelin': [
    { side: 'A', title: 'Custard Pie',             duration: '4:13' },
    { side: 'A', title: 'The Rover',               duration: '5:37' },
    { side: 'A', title: 'In My Time of Dying',     duration: '11:06'},
    { side: 'B', title: 'Houses of the Holy',      duration: '4:01' },
    { side: 'B', title: 'Trampled Under Foot',     duration: '5:35' },
    { side: 'B', title: 'Kashmir',                 duration: '8:32' },
    { side: 'C', title: 'In the Light',            duration: '8:46' },
    { side: 'C', title: 'Bron-Yr-Aur',            duration: '2:06' },
    { side: 'C', title: 'Down by the Seaside',     duration: '5:14' },
    { side: 'C', title: 'Ten Years Gone',          duration: '6:31' },
    { side: 'D', title: 'Night Flight',            duration: '3:37' },
    { side: 'D', title: 'The Wanton Song',         duration: '4:08' },
    { side: 'D', title: 'Boogie with Stu',         duration: '3:51' },
    { side: 'D', title: 'Black Country Woman',     duration: '4:24' },
    { side: 'D', title: 'Sick Again',              duration: '4:42' },
  ],

  // ── Nirvana ─────────────────────────────────────────────────────────
  'nevermind|nirvana': [
    { side: 'A', title: 'Smells Like Teen Spirit', duration: '5:01' },
    { side: 'A', title: 'In Bloom',                duration: '4:14' },
    { side: 'A', title: 'Come as You Are',         duration: '3:39' },
    { side: 'A', title: 'Breed',                   duration: '3:03' },
    { side: 'A', title: 'Lithium',                 duration: '4:17' },
    { side: 'B', title: 'Polly',                   duration: '2:57' },
    { side: 'B', title: 'Territorial Pissings',    duration: '2:22' },
    { side: 'B', title: 'Drain You',               duration: '3:43' },
    { side: 'B', title: 'Lounge Act',              duration: '2:36' },
    { side: 'B', title: 'Stay Away',               duration: '3:32' },
    { side: 'B', title: 'On a Plain',              duration: '3:16' },
    { side: 'B', title: 'Something in the Way',    duration: '3:52' },
  ],

  // ── The Beatles ─────────────────────────────────────────────────────
  'abbey road|the beatles': [
    { side: 'A', title: 'Come Together',                          duration: '4:20' },
    { side: 'A', title: 'Something',                              duration: '3:03' },
    { side: 'A', title: "Maxwell's Silver Hammer",               duration: '3:27' },
    { side: 'A', title: 'Oh! Darling',                           duration: '3:28' },
    { side: 'A', title: "Octopus's Garden",                      duration: '2:51' },
    { side: 'A', title: "I Want You (She's So Heavy)",           duration: '7:47' },
    { side: 'B', title: 'Here Comes the Sun',                    duration: '3:05' },
    { side: 'B', title: 'Because',                               duration: '2:45' },
    { side: 'B', title: 'You Never Give Me Your Money',          duration: '4:02' },
    { side: 'B', title: 'Sun King',                              duration: '2:26' },
    { side: 'B', title: 'Mean Mr. Mustard',                      duration: '1:06' },
    { side: 'B', title: 'Polythene Pam',                         duration: '1:12' },
    { side: 'B', title: 'She Came In Through the Bathroom Window', duration: '1:57' },
    { side: 'B', title: 'Golden Slumbers',                       duration: '1:31' },
    { side: 'B', title: 'Carry That Weight',                     duration: '1:36' },
    { side: 'B', title: 'The End',                               duration: '2:05' },
    { side: 'B', title: 'Her Majesty',                           duration: '0:23' },
  ],

  // ── AC/DC ────────────────────────────────────────────────────────────
  'back in black|ac/dc': [
    { side: 'A', title: 'Hells Bells',                         duration: '5:12' },
    { side: 'A', title: 'Shoot to Thrill',                     duration: '5:17' },
    { side: 'A', title: 'What Do You Do for Money Honey',      duration: '3:31' },
    { side: 'A', title: 'Given the Dog a Bone',               duration: '3:31' },
    { side: 'A', title: 'Let Me Put My Love into You',         duration: '4:15' },
    { side: 'B', title: 'Back in Black',                       duration: '4:15' },
    { side: 'B', title: 'You Shook Me All Night Long',         duration: '3:30' },
    { side: 'B', title: 'Have a Drink on Me',                  duration: '3:58' },
    { side: 'B', title: 'Shake a Leg',                         duration: '4:05' },
    { side: 'B', title: "Rock and Roll Ain't Noise Pollution", duration: '4:15' },
  ],

  // ── Metallica ────────────────────────────────────────────────────────
  'master of puppets|metallica': [
    { side: 'A', title: 'Battery',                    duration: '5:13' },
    { side: 'A', title: 'Master of Puppets',          duration: '8:35' },
    { side: 'A', title: 'The Thing That Should Not Be', duration: '6:36' },
    { side: 'A', title: 'Welcome Home (Sanitarium)',  duration: '6:27' },
    { side: 'B', title: 'Disposable Heroes',          duration: '8:17' },
    { side: 'B', title: 'Leper Messiah',              duration: '5:40' },
    { side: 'B', title: 'Orion',                      duration: '8:27' },
    { side: 'B', title: 'Damage, Inc.',               duration: '5:33' },
  ],
  'black album|metallica': [
    { side: 'A', title: 'Enter Sandman',          duration: '5:31' },
    { side: 'A', title: 'Sad but True',           duration: '5:24' },
    { side: 'A', title: 'Holier Than Thou',       duration: '3:47' },
    { side: 'A', title: 'The Unforgiven',         duration: '6:26' },
    { side: 'A', title: 'Wherever I May Roam',   duration: '6:43' },
    { side: 'B', title: "Don't Tread on Me",     duration: '4:00' },
    { side: 'B', title: 'Through the Never',     duration: '4:04' },
    { side: 'B', title: 'Nothing Else Matters',  duration: '6:29' },
    { side: 'B', title: 'Of Wolf and Man',       duration: '4:16' },
    { side: 'B', title: 'The God That Failed',   duration: '5:05' },
    { side: 'B', title: 'My Friend of Misery',   duration: '6:48' },
    { side: 'B', title: 'The Struggle Within',   duration: '3:52' },
  ],

  // ── Black Sabbath ────────────────────────────────────────────────────
  'paranoid|black sabbath': [
    { side: 'A', title: 'War Pigs',          duration: '7:57' },
    { side: 'A', title: 'Paranoid',          duration: '2:48' },
    { side: 'A', title: 'Planet Caravan',    duration: '4:33' },
    { side: 'A', title: 'Iron Man',          duration: '5:57' },
    { side: 'B', title: 'Electric Funeral',  duration: '4:51' },
    { side: 'B', title: 'Hand of Doom',      duration: '7:10' },
    { side: 'B', title: 'Rat Salad',         duration: '2:30' },
    { side: 'B', title: 'Fairies Wear Boots', duration: '6:13' },
  ],

  // ── Iron Maiden ──────────────────────────────────────────────────────
  'number of the beast|iron maiden': [
    { side: 'A', title: 'Invaders',                duration: '3:21' },
    { side: 'A', title: 'Children of the Damned',  duration: '4:34' },
    { side: 'A', title: 'The Prisoner',            duration: '6:03' },
    { side: 'A', title: '22 Acacia Avenue',        duration: '6:35' },
    { side: 'B', title: 'The Number of the Beast', duration: '4:50' },
    { side: 'B', title: 'Run to the Hills',        duration: '3:54' },
    { side: 'B', title: 'Gangland',                duration: '3:46' },
    { side: 'B', title: 'Hallowed Be Thy Name',    duration: '7:09' },
  ],

  // ── Slayer ───────────────────────────────────────────────────────────
  'reign in blood|slayer': [
    { side: 'A', title: 'Angel of Death',    duration: '4:51' },
    { side: 'A', title: 'Piece by Piece',    duration: '2:01' },
    { side: 'A', title: 'Necrophobic',       duration: '1:40' },
    { side: 'A', title: 'Altar of Sacrifice', duration: '2:49' },
    { side: 'A', title: 'Jesus Saves',       duration: '2:54' },
    { side: 'B', title: 'Criminally Insane', duration: '2:23' },
    { side: 'B', title: 'Reborn',            duration: '2:11' },
    { side: 'B', title: 'Epidemic',          duration: '2:23' },
    { side: 'B', title: 'Postmortem',        duration: '3:29' },
    { side: 'B', title: 'Raining Blood',     duration: '4:16' },
  ],

  // ── Miles Davis ──────────────────────────────────────────────────────
  'kind of blue|miles davis': [
    { side: 'A', title: 'So What',              duration: '9:22'  },
    { side: 'A', title: 'Freddie Freeloader',   duration: '9:46'  },
    { side: 'A', title: 'Blue in Green',        duration: '5:37'  },
    { side: 'B', title: 'All Blues',            duration: '11:33' },
    { side: 'B', title: 'Flamenco Sketches',    duration: '9:26'  },
  ],

  // ── John Coltrane ────────────────────────────────────────────────────
  'a love supreme|john coltrane': [
    { side: 'A', title: 'Part I – Acknowledgement', duration: '7:46'  },
    { side: 'A', title: 'Part II – Resolution',     duration: '7:23'  },
    { side: 'B', title: 'Part III – Pursuance',     duration: '10:52' },
    { side: 'B', title: 'Part IV – Psalm',          duration: '7:10'  },
  ],

  // ── Bill Evans ───────────────────────────────────────────────────────
  'waltz for debby|bill evans trio': [
    { side: 'A', title: 'My Foolish Heart',            duration: '5:53' },
    { side: 'A', title: 'Waltz for Debby',             duration: '6:59' },
    { side: 'A', title: 'Detour Ahead',                duration: '6:03' },
    { side: 'A', title: 'My Romance',                  duration: '7:08' },
    { side: 'B', title: 'Some Other Time',             duration: '4:54' },
    { side: 'B', title: 'Milestones',                  duration: '4:57' },
    { side: 'B', title: 'Porgy (I Loves You, Porgy)',  duration: '4:42' },
    { side: 'B', title: "Gloria's Step",               duration: '5:15' },
  ],

  // ── Dave Brubeck ─────────────────────────────────────────────────────
  'time out|dave brubeck quartet': [
    { side: 'A', title: 'Blue Rondo à la Turk',   duration: '6:44' },
    { side: 'A', title: 'Strange Meadow Lark',     duration: '7:22' },
    { side: 'A', title: 'Take Five',               duration: '5:24' },
    { side: 'B', title: "Three to Get Ready",      duration: '5:24' },
    { side: 'B', title: 'Kathy\'s Waltz',          duration: '4:48' },
    { side: 'B', title: 'Everybody\'s Jumpin\'',   duration: '4:22' },
    { side: 'B', title: 'Pick Up Sticks',          duration: '4:16' },
  ],

  // ── Art Blakey ───────────────────────────────────────────────────────
  "moanin'|art blakey": [
    { side: 'A', title: "Moanin'",        duration: '9:44' },
    { side: 'A', title: 'Are You Real',   duration: '5:02' },
    { side: 'A', title: 'Along Came Betty', duration: '7:39' },
    { side: 'B', title: 'The Drum Thunder Suite', duration: '6:51' },
    { side: 'B', title: 'Blues March',    duration: '6:11' },
    { side: 'B', title: "Come Rain or Come Shine", duration: '4:26' },
  ],

  // ── Fleetwood Mac ────────────────────────────────────────────────────
  'rumours|fleetwood mac': [
    { side: 'A', title: 'Second Hand News',       duration: '2:43' },
    { side: 'A', title: 'Dreams',                 duration: '4:14' },
    { side: 'A', title: 'Never Going to Give You Up', duration: '3:12' },
    { side: 'A', title: "Don't Stop",             duration: '3:11' },
    { side: 'A', title: 'Go Your Own Way',        duration: '3:38' },
    { side: 'B', title: 'Songbird',               duration: '3:20' },
    { side: 'B', title: 'The Chain',              duration: '4:30' },
    { side: 'B', title: 'You Make Loving Fun',    duration: '3:31' },
    { side: 'B', title: "I Don't Want to Know",  duration: '3:11' },
    { side: 'B', title: 'Oh Daddy',               duration: '3:55' },
    { side: 'B', title: 'Gold Dust Woman',        duration: '4:51' },
  ],

  // ── Eagles ───────────────────────────────────────────────────────────
  'hotel california|eagles': [
    { side: 'A', title: 'Hotel California',       duration: '6:30' },
    { side: 'A', title: 'New Kid in Town',        duration: '5:03' },
    { side: 'A', title: 'Life in the Fast Lane',  duration: '4:46' },
    { side: 'A', title: 'Wasted Time',            duration: '4:55' },
    { side: 'B', title: 'Wasted Time (Reprise)',  duration: '1:22' },
    { side: 'B', title: 'Victim of Love',         duration: '4:11' },
    { side: 'B', title: 'Pretty Maids All in a Row', duration: '4:05' },
    { side: 'B', title: 'Try and Love Again',     duration: '5:10' },
    { side: 'B', title: 'The Last Resort',        duration: '7:25' },
  ],

  // ── Queen ────────────────────────────────────────────────────────────
  'a night at the opera|queen': [
    { side: 'A', title: 'Death on Two Legs (Dedicated to...)', duration: '3:43' },
    { side: 'A', title: 'Lazing on a Sunday Afternoon',        duration: '1:08' },
    { side: 'A', title: "I'm in Love with My Car",            duration: '3:05' },
    { side: 'A', title: "You're My Best Friend",              duration: '2:50' },
    { side: 'A', title: "'39",                                 duration: '3:30' },
    { side: 'B', title: 'Sweet Lady',                          duration: '4:03' },
    { side: 'B', title: 'Seaside Rendezvous',                  duration: '2:15' },
    { side: 'B', title: "The Prophet's Song",                  duration: '8:17' },
    { side: 'B', title: 'Love of My Life',                     duration: '3:38' },
    { side: 'B', title: 'Good Company',                        duration: '3:26' },
    { side: 'B', title: 'Bohemian Rhapsody',                   duration: '5:55' },
    { side: 'B', title: 'God Save the Queen',                  duration: '1:12' },
  ],

  // ── David Bowie ──────────────────────────────────────────────────────
  'ziggy stardust|david bowie': [
    { side: 'A', title: 'Five Years',            duration: '4:42' },
    { side: 'A', title: 'Soul Love',             duration: '3:34' },
    { side: 'A', title: 'Moonage Daydream',      duration: '4:40' },
    { side: 'A', title: "It Ain't Easy",         duration: '2:58' },
    { side: 'A', title: 'Lady Stardust',         duration: '3:21' },
    { side: 'B', title: 'Star',                  duration: '2:47' },
    { side: 'B', title: 'Hang On to Yourself',   duration: '2:40' },
    { side: 'B', title: 'Ziggy Stardust',        duration: '3:13' },
    { side: 'B', title: 'Suffragette City',      duration: '3:25' },
    { side: 'B', title: "Rock 'n' Roll Suicide", duration: '4:18' },
  ],

  // ── Bruce Springsteen ────────────────────────────────────────────────
  'born to run|bruce springsteen': [
    { side: 'A', title: 'Thunder Road',             duration: '4:49' },
    { side: 'A', title: 'Tenth Avenue Freeze-out',  duration: '3:11' },
    { side: 'A', title: 'Night',                    duration: '3:00' },
    { side: 'A', title: 'Backstreets',              duration: '6:31' },
    { side: 'B', title: 'Born to Run',              duration: '4:30' },
    { side: 'B', title: "She's the One",            duration: '4:30' },
    { side: 'B', title: 'Meeting Across the River', duration: '3:18' },
    { side: 'B', title: 'Jungleland',               duration: '9:34' },
  ],

  // ── The Rolling Stones ───────────────────────────────────────────────
  'sticky fingers|the rolling stones': [
    { side: 'A', title: 'Brown Sugar',                 duration: '3:49' },
    { side: 'A', title: 'Sway',                        duration: '3:52' },
    { side: 'A', title: 'Wild Horses',                 duration: '5:41' },
    { side: 'A', title: "Can't You Hear Me Knocking", duration: '7:15' },
    { side: 'B', title: 'You Gotta Move',              duration: '2:34' },
    { side: 'B', title: 'Bitch',                       duration: '3:37' },
    { side: 'B', title: 'I Got the Blues',             duration: '3:52' },
    { side: 'B', title: 'Sister Morphine',             duration: '5:31' },
    { side: 'B', title: 'Dead Flowers',                duration: '4:04' },
    { side: 'B', title: 'Moonlight Mile',              duration: '5:56' },
  ],

  // ── Jimi Hendrix ─────────────────────────────────────────────────────
  'are you experienced|jimi hendrix': [
    { side: 'A', title: 'Foxy Lady',             duration: '3:19' },
    { side: 'A', title: 'Manic Depression',      duration: '3:41' },
    { side: 'A', title: 'Red House',             duration: '3:46' },
    { side: 'A', title: 'Can You See Me',        duration: '2:34' },
    { side: 'A', title: 'Love or Confusion',     duration: '3:11' },
    { side: 'B', title: "I Don't Live Today",   duration: '3:55' },
    { side: 'B', title: 'May This Be Love',      duration: '3:10' },
    { side: 'B', title: 'Fire',                  duration: '2:43' },
    { side: 'B', title: 'Third Stone from the Sun', duration: '6:44' },
    { side: 'B', title: 'Remember',              duration: '2:50' },
    { side: 'B', title: 'Are You Experienced?',  duration: '4:16' },
  ],

  // ── The Doors ────────────────────────────────────────────────────────
  'l.a. woman|the doors': [
    { side: 'A', title: 'The Changeling',                          duration: '4:19' },
    { side: 'A', title: 'Love Her Madly',                          duration: '3:15' },
    { side: 'A', title: 'Been Down So Long',                       duration: '4:36' },
    { side: 'A', title: 'Cars Hiss by My Window',                  duration: '4:11' },
    { side: 'A', title: 'L.A. Woman',                              duration: '7:50' },
    { side: 'B', title: "L'America",                               duration: '4:32' },
    { side: 'B', title: 'Hyacinth House',                          duration: '3:10' },
    { side: 'B', title: 'Crawling King Snake',                     duration: '4:56' },
    { side: 'B', title: 'The WASP (Texas Radio and the Big Beat)', duration: '4:13' },
    { side: 'B', title: 'Riders on the Storm',                     duration: '7:14' },
  ],

  // ── Daft Punk ────────────────────────────────────────────────────────
  'random access memories|daft punk': [
    { side: 'A', title: 'Give Life Back to Music', duration: '4:34' },
    { side: 'A', title: 'The Game of Love',        duration: '4:22' },
    { side: 'A', title: 'Giorgio by Moroder',      duration: '9:04' },
    { side: 'B', title: 'Within',                  duration: '3:47' },
    { side: 'B', title: 'Instant Crush',           duration: '5:37' },
    { side: 'B', title: 'Lose Yourself to Dance',  duration: '5:53' },
    { side: 'C', title: 'Touch',                   duration: '8:18' },
    { side: 'C', title: 'Get Lucky',               duration: '6:09' },
    { side: 'D', title: 'Beyond',                  duration: '4:50' },
    { side: 'D', title: 'Motherboard',             duration: '5:41' },
    { side: 'D', title: 'Fragments of Time',       duration: '4:03' },
    { side: 'D', title: "Doin' It Right",          duration: '4:10' },
    { side: 'D', title: 'Contact',                 duration: '6:21' },
  ],

  // ── Kraftwerk ────────────────────────────────────────────────────────
  'autobahn|kraftwerk': [
    { side: 'A', title: 'Autobahn',      duration: '22:35' },
    { side: 'B', title: 'Kometenmelodie 1', duration: '5:58' },
    { side: 'B', title: 'Kometenmelodie 2', duration: '7:20' },
    { side: 'B', title: 'Mitternacht',    duration: '4:20' },
    { side: 'B', title: 'Morgenspaziergang', duration: '4:46' },
  ],

  // ── The Chemical Brothers ────────────────────────────────────────────
  'dig your own hole|the chemical brothers': [
    { side: 'A', title: 'Block Rockin\' Beats', duration: '5:16' },
    { side: 'A', title: 'Dig Your Own Hole',    duration: '4:35' },
    { side: 'A', title: 'Elektrobank',          duration: '7:07' },
    { side: 'B', title: 'Piku',                 duration: '2:44' },
    { side: 'B', title: 'Setting Sun',          duration: '5:00' },
    { side: 'B', title: 'It Doesn\'t Matter',  duration: '6:04' },
    { side: 'C', title: 'Don\'t Stop the Rock', duration: '5:21' },
    { side: 'C', title: 'Get Up on It Like This', duration: '4:50' },
    { side: 'C', title: 'Lost in the K-Hole',  duration: '4:13' },
    { side: 'D', title: 'Where Do I Begin',     duration: '5:54' },
    { side: 'D', title: 'The Private Psychedelic Reel', duration: '11:35' },
  ],

  // ── Israeli ──────────────────────────────────────────────────────────
  'עוז|אריק איינשטיין': [
    { side: 'א', title: 'מה אתה עושה',    duration: '3:10' },
    { side: 'א', title: 'אני ואתה',       duration: '3:45' },
    { side: 'א', title: 'שיר',            duration: '2:55' },
    { side: 'א', title: 'ציפור ים',       duration: '4:10' },
    { side: 'ב', title: 'עוז',            duration: '4:20' },
    { side: 'ב', title: 'תפוח בגינה',     duration: '3:15' },
    { side: 'ב', title: 'ים וסערה',       duration: '3:50' },
    { side: 'ב', title: 'יש לי נגינה',   duration: '3:30' },
  ],
  'שיר פשוט|שלמה ארצי': [
    { side: 'א', title: 'אז את',         duration: '3:22' },
    { side: 'א', title: 'שיר פשוט',      duration: '4:01' },
    { side: 'א', title: 'בן אדם',        duration: '3:44' },
    { side: 'א', title: 'כמה שעות',      duration: '3:05' },
    { side: 'ב', title: 'אחת אחת',       duration: '3:15' },
    { side: 'ב', title: 'שלום לך',       duration: '4:30' },
    { side: 'ב', title: 'תמיד',          duration: '3:10' },
    { side: 'ב', title: 'חיוך',          duration: '2:58' },
  ],
  'פוזי|אריק איינשטיין': [
    { side: 'א', title: 'פוזי',          duration: '3:32' },
    { side: 'א', title: 'קרוסלה',        duration: '2:55' },
    { side: 'א', title: 'לילה שקט',      duration: '4:10' },
    { side: 'ב', title: 'שיר לפנות בוקר', duration: '3:48' },
    { side: 'ב', title: 'פתח לי את הדלת', duration: '3:22' },
    { side: 'ב', title: 'כולנו',          duration: '4:05' },
  ],
}
