/**
 * Editorial seed content. Original writing grounded in the news cycle of
 * mid-August 2026 — the grid-transformer shortage, agentic AI saturating the
 * open web, Taiwan's civil-defense drills, the Sweat buyback, the World Cup
 * branding restrictions, and the rest of the week's conversation.
 */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export type SeedArticle = {
  title: string;
  dek: string;
  excerpt: string;
  categorySlug: string;
  authorIndex: number;
  coverImage: string;
  coverCaption?: string;
  coverCredit?: string;
  tags: string[];
  format: "feature" | "standard" | "brief" | "interview" | "essay" | "photo";
  isHero?: boolean;
  isCoverStory?: boolean;
  featured?: boolean;
  daysAgo: number;
  pullQuote?: { text: string; attribution: string };
  seoDescription?: string;
  content: string;
};

export const SEED_ARTICLES: SeedArticle[] = [
  {
    title: "What Happens If the Lights Don't Come Back On?",
    dek: "America's grid depends on thousands of aging, hand-built transformers. A single replacement takes five years to make — and the waiting list is getting longer.",
    excerpt:
      "The machines that keep the power on are old, irreplaceable in a hurry, and made by a shrinking number of factories. Inside the quiet crisis at the heart of the grid.",
    categorySlug: "affairs",
    authorIndex: 1,
    coverImage: u("photo-1473341304170-971dccb5ac1e"),
    coverCaption: "High-voltage lines outside a substation in the American Southwest.",
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Energy", "Infrastructure", "United States"],
    format: "feature",
    isHero: true,
    daysAgo: 0,
    pullQuote: {
      text: "We are running civilisation on machines nobody remembers how to make quickly.",
      attribution: "A federal grid-security adviser",
    },
    seoDescription:
      "America's power grid depends on aging, hand-built transformers that take years to replace. An investigation into the quiet crisis beneath the switch.",
    content: `<p>The largest machines in American life are ones almost nobody has seen. Large power transformers — steel boxes the size of a small house, filled with oil and copper coil — sit behind chain-link fences at the edges of cities, stepping voltage up and down so that electricity generated hundreds of miles away arrives at a socket at exactly the pressure a phone charger expects. There are tens of thousands of them. Most were installed when Lyndon Johnson or Richard Nixon was president. They were built to last forty years. The average unit is now pushing well past it.</p>
<p>This would be a manageable problem if a transformer were a thing you could order. It is not. Each large unit is engineered for its exact position on the grid — its voltage, its load, its physical footprint — and then built largely by hand, by workers winding copper with a patience that resists automation. An order placed today is quoted at three to five years. A decade ago it was under one.</p>
<h2>A supply chain with no slack</h2>
<p>The arithmetic is uncomfortable. Domestic factories can produce a few hundred large power transformers a year. The grid needs thousands over the next decade merely to replace what is wearing out — before counting data centres, electrified transport, or the re-industrialisation both parties now campaign on. The gap is filled from abroad, mostly from a handful of plants in Asia and Europe whose order books are just as full.</p>
<p>The margin for failure, meanwhile, is thin in ways the public rarely sees. When a big unit fails, utilities borrow spares from one another through informal sharing agreements — a system one engineer described to me as "a neighbourhood tool shed, except the tool weighs four hundred tonnes and there are three of them for the whole neighbourhood."</p>
<blockquote><p>We are running civilisation on machines nobody remembers how to make quickly.</p><cite>A federal grid-security adviser</cite></blockquote>
<h2>What failure actually looks like</h2>
<p>Grid planners are careful with their scenarios, because the honest ones sound like fiction. Lose a transformer to age and the neighbours carry the load while a spare is trucked in. Lose a dozen to a storm, a solar event, or sabotage, and the sharing arrangements exhaust themselves within days. The replacement queue is then not measured in weeks. It is measured in years — years in which some region of the country runs on rationed, rotating power.</p>
<p>The fixes are known and unglamorous: standardise designs so units are interchangeable; stockpile strategic spares the way the nation stockpiles oil; pay to train the winders and engineers a factory takes a decade to develop. Bills to those ends have been drafted, praised, and left to expire in committee more than once. The machines, meanwhile, keep aging at the rate machines do — one day at a time, indifferent to the legislative calendar.</p>
<p>The grid is the rare piece of infrastructure whose success is measured by its invisibility. The people who maintain it would like it to stay boring. Their worry, expressed quietly and consistently, is that the country has mistaken boring for safe.</p>`,
  },
  {
    title: "The Internet Is Quietly Becoming Post-Human",
    dek: "Chatbots now write to other chatbots — negotiating, summarising, and filling the open web with text no person will ever read. What happens to a commons when the crowd leaves?",
    excerpt:
      "A growing share of the web's traffic, text, and conversation is machine-to-machine. The strange economics — and stranger culture — of an internet that no longer needs us.",
    categorySlug: "ideas",
    authorIndex: 2,
    coverImage: u("photo-1518770660439-4636190af475"),
    coverCaption: "The conversation continues whether or not anyone is listening.",
    coverCredit: "Illustration for PrimeCrest",
    tags: ["Artificial Intelligence", "Technology", "Society"],
    format: "essay",
    isCoverStory: true,
    daysAgo: 1,
    pullQuote: {
      text: "The web was built as a place for people to talk. Increasingly it is a place where our proxies talk about us.",
      attribution: "From the essay",
    },
    content: `<p>Sometime in the past two years — nobody can point to the week — the open internet crossed a threshold that would have sounded absurd at its founding: the majority of what is written on it each day is no longer written by people. Product reviews answer other product reviews. Customer-service agents negotiate with procurement agents. A restaurant's booking bot confirms a table with the assistant that requested it, and both send their humans a cheerful summary of a conversation neither human will read.</p>
<p>None of this is a scandal, exactly. Each automation was adopted for a reason, by someone saving time they genuinely did not have. The strangeness is only visible in aggregate: a commons built for human conversation, increasingly occupied by our proxies, still wearing our names.</p>
<h2>The economics of empty rooms</h2>
<p>Advertising, the web's founding business model, assumed a human on the other end of the impression. That assumption is now an open question with a dollar figure attached. When an agent reads forty articles to brief its owner, who saw the ads? When a model summarises a recipe site, who owes the writer? The industry's answer so far has been a shrug and a lawsuit, in that order.</p>
<p>Publishers are responding the way institutions do when a commons stops paying: they are enclosing. Paywalls harden. Archives license directly to model companies. The open web — the layer where a curious stranger could wander in — thins out, not because anyone killed it, but because the economics that watered it dried up.</p>
<blockquote><p>The web was built as a place for people to talk. Increasingly it is a place where our proxies talk about us.</p><cite>From the essay</cite></blockquote>
<h2>What is worth keeping</h2>
<p>It is tempting to write an elegy and be done. The better exercise is to ask what, specifically, was valuable about the human web — and to notice that those things are portable. Judgment is portable. Wit is portable. The knowledge that a particular person, with a name and a reputation to lose, stands behind a sentence — that is portable too, and it may be the scarcest resource of the next decade.</p>
<p>The post-human internet will be enormous, efficient, and mostly beneath notice, like plumbing. The human internet will be smaller, slower, and signed. Publications like this one are a bet that the second kind is not nostalgia. It is a market.</p>`,
  },
  {
    title: "She Sold Her Company for a Fortune. Buying It Back Was Harder.",
    dek: "A conversation with a founder who exited, watched her company drift, and paid to take the wheel again — on what ownership actually buys.",
    excerpt:
      "Founders dream of the exit. Fewer talk about the morning after. An interview about selling, regretting, and the unglamorous work of buying back your own name.",
    categorySlug: "business",
    authorIndex: 0,
    coverImage: u("photo-1573496359142-b8d87734a5a2"),
    coverCaption: "\"The company was fine. That was the problem. Fine was never the point.\"",
    coverCredit: "Portrait for PrimeCrest",
    tags: ["Founders", "Entrepreneurship", "The Interview"],
    format: "interview",
    featured: true,
    daysAgo: 1,
    content: `<p>The exit is the founding myth of modern entrepreneurship: build, sell, exhale. The founder I met this week — she asked that we focus on the mechanics rather than the brand, which readers will recognise anyway — did all three. Then, three years later, she assembled the capital to buy the company back, at a price she describes as "emotionally reasonable and financially insane."</p>
<p>We spoke for two hours. What follows is edited for length and clarity.</p>
<h2>On the morning after the sale</h2>
<p><strong>You've described the sale as the best decision you made and the worst year of your life. Both?</strong></p>
<p>Both. The wire hits and you feel weightless, and then about six weeks later you realise weightless is another word for untethered. I'd spent nine years making forty decisions a day about this thing. Suddenly my opinion was one input in a quarterly deck. The company didn't collapse — the new owners were competent. It just became <em>fine</em>. And fine was never the point.</p>
<p><strong>What did the buyers optimise that you wouldn't have?</strong></p>
<p>Everything measurable. Retention curves, payback periods, cost per acquisition. All real things! But the community — the unmeasurable thing that made the measurable things move — was treated as a marketing expense. You can run a brand like that for years and the numbers barely complain. Then one day they do, all at once.</p>
<h2>On buying it back</h2>
<p><strong>Walk me through the decision to return.</strong></p>
<p>It wasn't romantic. I saw the metrics soften and I knew — the way you know a friend's voice on a bad day — exactly what was wrong and exactly how long it would take to fix. Nobody else was priced to believe it. That's what a buyback really is: an information advantage plus an emotional one, and you had better be honest about which is which.</p>
<p><strong>What's different about ownership the second time?</strong></p>
<p>I stopped confusing scale with success. The first time, every decision was a step on a ladder someone else built — raise, grow, exit. Now the question is simpler: does this make the product better and the company more durable? If a decision doesn't clear that bar, it doesn't matter whose spreadsheet it flatters. Ownership, it turns out, isn't the equity. It's the right to define what winning means.</p>`,
  },
  {
    title: "Taiwan's Civilians Are Training for a War They Hope Never Comes",
    dek: "In church halls and school gyms, volunteers practise triage, blackout drills, and rumor control. The island's quiet bet: resilience itself is deterrence.",
    excerpt:
      "Civil-defense courses in Taiwan have waiting lists for the first time. What ordinary preparation looks like in the shadow of an extraordinary threat.",
    categorySlug: "affairs",
    authorIndex: 1,
    coverImage: u("photo-1480796927426-f609979314bd"),
    coverCaption: "Evening in a dense city block. The drills are practised for streets like these.",
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Taiwan", "Security", "Asia"],
    format: "standard",
    featured: true,
    daysAgo: 0,
    content: `<p>The first thing the instructor teaches is not first aid. It is scepticism. "In the first hour," she tells a class of forty — office workers, retirees, a couple with matching hiking gear — "the most dangerous thing moving through this city will be information." Then she demonstrates a tourniquet.</p>
<p>Courses like this one, run by civic groups across Taiwan, were a niche pursuit five years ago, the province of preppers and idealists. They now have waiting lists. The curriculum is deliberately unheroic: how to stop bleeding, how to find water when the pumps lose power, how to verify a claim before forwarding it, which neighbour has the generator and which has the nursing degree.</p>
<h2>Resilience as strategy</h2>
<p>Defence analysts have a term for what these volunteers are building — "societal resilience" — and a theory about why it matters. An adversary weighing coercion must estimate not only an island's missiles but its nerves: how long its people can absorb disruption before pressure turns political. Every church-hall triage class shifts that estimate a little. It is deterrence practised in comfortable shoes.</p>
<p>The government has noticed, extending conscription and folding civilian drills into national exercises. But the movement's energy remains stubbornly bottom-up, and its participants are careful with their words. Nobody in the gym says the name of the country across the strait. They say "a disaster," and everyone understands the range of the term.</p>
<h2>The ordinary heart of it</h2>
<p>What stays with a visitor is not the hardware — there barely is any — but the tone. No bravado, no doom. A man in his sixties practising a radio check with the seriousness of a man who has decided that seriousness is the useful contribution left to him. The couple with hiking gear labelling a map of their apartment block: who is elderly, who has children, who will need help on the stairs.</p>
<p>Preparation, here, has become a form of citizenship — and perhaps of hope. You do not label a map for a city you expect to abandon.</p>`,
  },
  {
    title: "The World Cup Covered Up the Logos. The Strong Brands Didn't Mind.",
    dek: "FIFA's sponsorship rules forced famous marks off shirts and stadiums — and accidentally ran the world's largest brand-equity experiment.",
    excerpt:
      "When the logos came off at the World Cup, some brands vanished and others became more recognisable than ever. The difference is the whole game.",
    categorySlug: "business",
    authorIndex: 0,
    coverImage: u("photo-1489944440615-453fc2b6a9a9"),
    coverCaption: "A brand you can identify at 80 metres, in the rain, with the name removed, is an asset.",
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Marketing", "Branding", "Sport"],
    format: "standard",
    featured: true,
    daysAgo: 2,
    content: `<p>The strangest sight of this World Cup cycle was absence. FIFA's clean-stadium rules and sponsorship exclusivities meant that some of the most recognisable logos in commerce spent the tournament taped over, pixelated, or simply removed. Marketing departments treated it as a crisis. It was actually a measurement.</p>
<p>Because here is what happened: the strongest brands remained perfectly identifiable. A certain three-stripe silhouette needs no wordmark. A particular shade of red on an airline's livery, a stance, a typeface, a shape of bottle — viewers named them instantly in social clips, logo or no logo. Weaker brands, stripped of their labels, dissolved into the crowd.</p>
<h2>Equity is what survives subtraction</h2>
<p>Brand equity is usually discussed in the abstract, measured by surveys and valued by accountants in footnotes. The tournament offered a cruder, better test: subtract the name and see what remains. What remains — recognition without announcement — is the compound interest of years of consistency. Distinctive assets, the academics call them. Habits of shape and colour maintained long after the creative team was bored of them.</p>
<p>The lesson lands harder in a feed-driven media environment than it ever did on television. In a two-second scroll, nobody reads your logo anyway. You are recognised the way a friend is recognised at a distance: by gait, not by name-tag.</p>
<h2>What to do about it</h2>
<p>The practical takeaway for anyone who manages a brand is uncomfortable, because it argues against novelty — the thing marketing careers are built on. Pick your assets. Repeat them past the point of internal boredom. Treat rebrands the way surgeons treat operations: sometimes necessary, never casual. The World Cup's accidental experiment suggests the market rewards the companies that treat recognition as infrastructure, and punishes the ones that treat it as a season.</p>`,
  },
  {
    title: "How to Sell Your Business Without Selling Its Soul",
    dek: "An exit is a financial event. A legacy is an operating decision made years earlier. Advisers and founders on structuring the sale you can live with.",
    excerpt:
      "The right exit protects more than price: the people, the relationships, and the name on the door. What founders wish they had negotiated for.",
    categorySlug: "business",
    authorIndex: 2,
    coverImage: u("photo-1454165804606-c3d57bc86b40"),
    coverCredit: "Photograph for PrimeCrest",
    tags: ["M&A", "Founders", "Strategy"],
    format: "brief",
    daysAgo: 2,
    content: `<p>Every founder knows the number they would sell for. Very few, the advisers say, know the terms — and terms are where legacies live or die. Price is a headline; earn-outs, retention pools, brand covenants, and board composition are the plot.</p>
<p>The pattern in unhappy exits is consistent. A founder optimises the multiple, signs quickly, and discovers the things she assumed were understood — that the workshop stays open, that the old supplier keeps the contract, that the name doesn't move to a holding company in a tax-efficient jurisdiction — were never written down. Buyers are not villains. They are optimisers, and anything not in the document is available to be optimised.</p>
<h2>The unglamorous checklist</h2>
<p>Founders who exited well describe the same homework: start two years early, so the company runs without you and buyers pay for a machine rather than a person. Decide what is non-negotiable — people, place, name — and trade price for it explicitly, because you will get nothing you did not price. Vet the buyer's last three acquisitions the way they vet your last three years. And put the legacy terms in the purchase agreement, not the press release.</p>
<p>The best line of the week came from an adviser who has seen forty of these: "A good exit is one where, five years later, you can walk into the building. A great one is where they're glad to see you."</p>`,
  },
  {
    title: "Steady Teams Are Built in Unsteady Weather",
    dek: "Prolonged uncertainty is now the operating environment, not the exception. The leaders keeping teams whole are doing small things, relentlessly.",
    excerpt:
      "Forget grand gestures. Research and practice agree: in long uncertainty, trust is built through small, consistent acknowledgment. Here is what that looks like.",
    categorySlug: "leadership",
    authorIndex: 2,
    coverImage: u("photo-1521737604893-d14cc237f11d"),
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Management", "Teams", "Workplace"],
    format: "standard",
    featured: true,
    daysAgo: 3,
    content: `<p>The half-life of a corporate pep talk is about a week. That is the uncomfortable finding a generation of managers has run into since the world made "unprecedented" a quarterly word. Town halls soothe; then the second round of restructuring rumours arrives, and the soothing evaporates. What does not evaporate, it turns out, is smaller and cheaper: acknowledgment.</p>
<p>The evidence, from organisational research and from any honest manager's experience, points the same direction. Teams under sustained pressure do not primarily need optimism, which they discount, or transparency theatre, which they see through. They need proof that effort is witnessed. A specific thank-you, sent the day the work shipped. Credit passed upward with names attached. A leader who says "I don't know yet" and then — this is the whole trick — comes back when they do.</p>
<h2>Rituals beat speeches</h2>
<p>The practices that survive contact with a bad quarter are rituals, not events. A weekly note that names three concrete contributions. Retrospectives that examine decisions rather than assigning blame. Managers trained to ask "what's in your way?" and empowered to actually move the thing named. None of it photographs well for the annual report. All of it compounds.</p>
<p>There is a hard-nosed case here, not just a humane one. Replacing a senior engineer costs a year of salary; replacing trust costs more and takes longer. In uncertain weather, acknowledgment is not a soft skill. It is retention strategy, priced accordingly.</p>`,
  },
  {
    title: "The Productivity Gap Is a Management Gap",
    dek: "The tools got faster. The organisations didn't. Closing the distance between what technology permits and what companies achieve is the decade's quiet contest.",
    excerpt:
      "AI was supposed to end the productivity paradox. Instead it sharpened it: the gap between the best-run firms and the rest is widening. The difference is management.",
    categorySlug: "leadership",
    authorIndex: 0,
    coverImage: u("photo-1551288049-bebda4e38f71"),
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Productivity", "AI", "Strategy"],
    format: "brief",
    daysAgo: 3,
    content: `<p>The awkward fact about the AI boom is showing up in the aggregate statistics: the tools are spectacular and the productivity numbers are merely fine. Economists call it a diffusion problem. Operators know it by a homelier name — the distance between buying software and changing how work happens.</p>
<p>The firms pulling ahead share habits that predate the technology. They measure outcomes rather than activity, so automation shows up as capacity instead of threat. They redesign the process before wiring the tool into it, having learned that automating a bad process gives you bad results at scale. And they push decisions to where the information lives, because a model that answers in seconds is wasted inside an approval chain that answers in weeks.</p>
<h2>The unfashionable conclusion</h2>
<p>None of this is glamorous, which is why it is rare. The winners of the last technological platform shift were not the companies with the earliest licences but the ones that reorganised around the new cost structure. The pattern is repeating. The constraint is not the model's intelligence. It is the organisation's willingness to change what it does with an answer once it has one — and that, unlike the software, cannot be bought by the seat.</p>`,
  },
  {
    title: "Everyone Loves Bourdain. Almost Everyone Misreads Him.",
    dek: "The devotion is cultish; the message got lost in translation. He wasn't telling you to eat adventurously. He was telling you to pay attention.",
    excerpt:
      "Years after his death, Anthony Bourdain's fans keep multiplying — and keep flattening his message into a travel aesthetic. The harder gospel is still there in the work.",
    categorySlug: "culture",
    authorIndex: 1,
    coverImage: u("photo-1414235077428-338989a2e8c0"),
    coverCaption: "The table was never the point. The people across it were.",
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Food", "Television", "Legacy"],
    format: "essay",
    featured: true,
    daysAgo: 1,
    pullQuote: {
      text: "He treated a bowl of noodles as an excuse for the only luxury he really endorsed: sitting still and listening to someone unlike you.",
      attribution: "From the essay",
    },
    content: `<p>The pilgrimage sites are mapped now. The noodle shop in Hanoi with the low plastic stools. The Provincetown restaurants of the early kitchen years. Fans arrive with phones raised, order what he ordered, and post the result with a quote about travel changing you. The devotion is genuine and touching. It is also, often, a misreading.</p>
<p>Watch the shows again — really watch — and the food is a pretext. The signature move is not the bite; it is the pause afterwards, when he turns to the person who cooked it and asks a question about their life, and then, crucially, shuts up. Cameras kept rolling through silences most television would cut. That was the product: attention, paid in full, to people the audience had been trained to overlook.</p>
<h2>The uncomfortable half of the gospel</h2>
<p>The flattened version of his message — be curious, eat everything — flatters the consumer. The actual version had edges. He went back to places the news had abandoned. He put politics in a food show because dinner is political, and said so with a bluntness that would struggle through a network's standards process today. The empathy was not a vibe. It was a discipline, practised on deadline, in places without room service.</p>
<blockquote><p>He treated a bowl of noodles as an excuse for the only luxury he really endorsed: sitting still and listening to someone unlike you.</p><cite>From the essay</cite></blockquote>
<p>The inheritance worth claiming is not an itinerary. It is a practice available in your own postcode tonight: order from the place you always pass, ask the person who made it one honest question, and listen past the point of comfort. No passport required. That is the gospel, and it was always harder than it looked on television.</p>`,
  },
  {
    title: "Céline Dion and the Art of the Second Act",
    dek: "After a diagnosis that would have ended most careers, the return is being staged on her terms — slower, rarer, and somehow larger.",
    excerpt:
      "The comeback tour is pop's oldest genre. Céline Dion is rewriting its rules: fewer dates, total candour, and a voice managed like the finite resource it is.",
    categorySlug: "culture",
    authorIndex: 2,
    coverImage: u("photo-1493225457124-a3eb161ffa5f"),
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Music", "Celebrity", "Resilience"],
    format: "standard",
    daysAgo: 2,
    content: `<p>The comeback is pop music's most reliable script: the absence, the teaser, the arena, the tears. What makes this return different is that the illness at the centre of it — stiff-person syndrome, rare and cruel to a singer — does not resolve. There is no cured-and-better-than-ever arc available. So the script is being rewritten around a harder question: how does a performer built on vocal maximalism perform within limits?</p>
<p>The answer, visible in the staging choices, is candour as spectacle. The condition is named from the stage. The setlist bends around the voice's new geography rather than pretending the old map still applies. Dates are scarce by design, priced and produced as events rather than repetitions. Scarcity, it turns out, reads as luxury — and honesty reads as strength.</p>
<h2>What the business is learning</h2>
<p>The industry is watching closely, because the economics are instructive. A residency model with recovery time built in. Documentary access traded for narrative control. Merchandising an era rather than an album. It amounts to a template for late-career artistry that treats the performer as a finite resource to be stewarded, not a machine to be toured until failure.</p>
<p>The cultural lesson may matter more than the commercial one. An audience raised on effortless perfection is proving hungry for its opposite: visible effort, honestly framed. The voice cracks where it used to soar, the room knows why, and the room stands anyway. That is not diminished stardom. It might be the only kind that lasts.</p>`,
  },
  {
    title: "How Shania Twain Became Gen Z's Favourite Country Star",
    dek: "The kids found the leopard print, the key change, and the attitude. A nineties megastar's second audience says something about pop's memory.",
    excerpt:
      "On dance floors and feeds, a generation born after her peak has adopted Shania Twain as an icon. The revival is organic, ironic, and completely sincere at once.",
    categorySlug: "culture",
    authorIndex: 1,
    coverImage: u("photo-1470229722913-7c0e2dbbafd3"),
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Music", "Pop Culture", "Internet"],
    format: "brief",
    daysAgo: 4,
    content: `<p>The clips arrive nightly: a twenty-two-year-old in thrifted leopard print, lip-syncing "That Don't Impress Me Much" to two million strangers, none of whom were alive when it charted. The algorithm did not invent this affection, though it accelerated it. Something in the catalogue — the wink, the self-possession, the hooks engineered like suspension bridges — reads to a new generation as both camp and completely sincere.</p>
<p>Revivals usually flatten their subjects into aesthetic. This one has been shrewder, partly because its subject has. She duets with the kids covering her, headlines festivals booked by people who discovered her through their phones, and treats the irony with the good humour of someone who was underestimated the first time and remembers it.</p>
<p>The lesson for the business is about durability: songs built on craft outlive their eras and wait, patiently, for the feed to find them. The lesson for the rest of us is simpler. The twenty-year nostalgia cycle is now a five-year one, running constantly, in all directions. Nothing beloved stays buried. Man, I feel like a catalogue manager.</p>`,
  },
  {
    title: "The Seafloor Is the New High Ground",
    dek: "Undersea cables carry the world's data; mining claims carve up its seabed. The quietest layer of the planet is suddenly contested space.",
    excerpt:
      "Ninety-nine percent of intercontinental data moves through cables on the ocean floor — guarded by treaties written for another century. The scramble below the waves, explained.",
    categorySlug: "science",
    authorIndex: 0,
    coverImage: u("photo-1518837695005-2083093ee35b"),
    coverCaption: "The surface is the calm part.",
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Oceans", "Infrastructure", "Geopolitics"],
    format: "standard",
    featured: true,
    daysAgo: 0,
    content: `<p>Somewhere under the Atlantic right now, a cable the width of a garden hose is carrying this sentence. Some ninety-nine percent of intercontinental data — the markets, the wars, the video calls — travels not by satellite but through a few hundred fibre-optic threads laid across the seabed, maintained by a small fleet of specialised ships and protected, in the main, by the assumption that nobody would dare.</p>
<p>That assumption is expiring. Cables near contested waters now suffer "anchor drags" with a regularity statisticians find implausible. Navies that once ignored the seabed publish doctrines about it. And alongside the data lines, a second contest has opened: licences to mine the deep floor for the nickel and cobalt that batteries demand, granted by an international authority whose rulebook remains, decades on, unfinished.</p>
<h2>Law written for a slower ocean</h2>
<p>The governing treaty was drafted when the seabed's main economic product was imagination. It says cables shall be protected, and provides almost no machinery for protecting them. It says the deep floor is the "common heritage of mankind," and leaves the definition of heritage to a body that meets slowly while survey ships move fast. Into that gap have stepped the usual actors: states with long coastlines, companies with long time horizons, and insurers, who as ever are the first to price what diplomats defer.</p>
<h2>Resilience, again</h2>
<p>The practical response mirrors the grid's: redundancy. More cables on more routes; repair ships treated as strategic assets; landing stations hardened like the critical infrastructure they always were. The ocean's bottom will not stay boring. The work is to make it boring enough — to keep the quietest layer of the planet dull, humming, and beneath the news.</p>`,
  },
  {
    title: "Dressing for the US Open, a Field Guide",
    dek: "Tennis whites meet city heat. What the smart money wears to Flushing Meadows — and what it skips.",
    excerpt:
      "The US Open is fashion's favourite sporting event because the dress code is unwritten. A practical, opinionated guide to getting it right in the late-summer heat.",
    categorySlug: "lifestyle",
    authorIndex: 2,
    coverImage: u("photo-1554068865-24cecd4e34b8"),
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Style", "Tennis", "New York"],
    format: "brief",
    daysAgo: 4,
    content: `<p>The US Open is the rare event where the crowd dresses better than the players are allowed to. There is no Wimbledon rulebook, only conventions — and conventions, as any editor will tell you, are just style with confidence. Late August in Queens supplies the constraints: heat, distance, and the long unshaded walk from the 7 train.</p>
<p>The uniform that works has stabilised into something like a code. Natural fibres, because polyester and ninety degrees are enemies. White, cream, and navy as the base — a nod to tennis without costume. One considered accessory: the good sunglasses, the straw hat that has survived three summers, the watch you actually wear. Shoes you can stand in for six hours, which this year means the return of the plain white sneaker, unbranded and unapologetic.</p>
<p>What to skip: anything new that day, logos above a whisper, and the blazer bought for air-conditioned rooms. The event rewards the same virtues the sport does — preparation, restraint, and the appearance of ease that only planning produces. Dress like you might be seen, not like you need to be.</p>`,
  },
  {
    title: "The New Face of Normal",
    dek: "Procedures once whispered about are now itemised on social feeds. What the mainstreaming of cosmetic surgery says about work, age, and honesty.",
    excerpt:
      "Face-lifts at forty, openly discussed. The stigma didn't vanish — it inverted. Inside the normalisation of cosmetic work, and its quietly rising costs.",
    categorySlug: "lifestyle",
    authorIndex: 1,
    coverImage: u("photo-1522337660859-02fbefca4702"),
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Beauty", "Society", "Health"],
    format: "standard",
    daysAgo: 3,
    content: `<p>The before-and-after used to be a secret genre, traded in gossip columns and denied in interviews. It is now a content category, posted first-person, with the surgeon tagged. Somewhere in the past five years the stigma around cosmetic work did not disappear so much as invert: the shame moved from having work done to lying about it.</p>
<p>The drivers are not mysterious. A decade of seeing one's own face in video calls. An economy that treats appearance as a labour-market signal well past the industries that admit it. And a procedure menu that expanded downward in invasiveness and cost, making "a little work" a category between skincare and surgery that did not previously exist.</p>
<h2>The honesty dividend, and its price</h2>
<p>There is something genuinely healthier in the candour. The old regime demanded impossible faces and punished any visible effort to achieve them — a rigged game, especially for women in public life. Open discussion de-rigs it a little, and turns patients into informed consumers with second opinions and complication statistics.</p>
<p>But normalisation has its own arithmetic. When intervention becomes ordinary, abstention becomes a statement, and faces that have simply aged start to read — in castings, in boardrooms, on dating apps — as a choice. The freedom to do something drifts, quietly, toward the expectation that you will. The new honesty is real progress. It would be more honest still to say what it costs.</p>`,
  },
  {
    title: "'Stack' Ate the Dictionary",
    dek: "A word for a pile of pancakes became the way we describe technology, habits, money, and selves. On language's quiet mechanisation.",
    excerpt:
      "Tech stacks, habit stacks, wealth stacks. How one blunt syllable came to describe modern life — and what its success says about how we see ourselves.",
    categorySlug: "ideas",
    authorIndex: 0,
    coverImage: u("photo-1504711434969-e33886168f5c"),
    coverCredit: "Photograph for PrimeCrest",
    tags: ["Language", "Culture", "Technology"],
    format: "brief",
    daysAgo: 5,
    content: `<p>Track the word "stack" through a single day of ordinary reading and you will find it doing jobs no word should be asked to do alone. Engineers ship on a tech stack. Founders pitch their AI stack. The wellness feed recommends a morning stack of supplements and a habit stack to take them. Personal-finance posters photograph their stacks. Somewhere along the way the pancake breakfast became a worldview.</p>
<p>The appeal is easy to diagnose. A stack is modular: components chosen, swapped, optimised. To describe your life as a stack is to claim an engineer's relationship to it — nothing inherited, everything selected, every layer replaceable when a better one ships. It is the vocabulary of control, borrowed by people who feel they have little.</p>
<p>What the metaphor quietly deletes is everything unstackable: the friendships that arrived by accident, the tastes you did not choose, the parts of a self that resist versioning. Languages always borrow their metaphors from the reigning technology — we were clockwork once, then steam, then computers. Now we are architectures. It is worth remembering, between optimisations, that the metaphor is the machine's. The life is still yours.</p>`,
  },
  {
    title: "Master of the Deal: Shermel A. Jeffers Chandwani",
    dek: "A banker's discipline, a broker's nerve, and a luxury real estate practice built on an island that still rewards people who know the difference.",
    excerpt:
      "From banking powerhouse to Caribbean real estate authority — how Shermel A. Jeffers Chandwani built SAJ Interior Design & Real Estate Services into a US$300M+ portfolio.",
    categorySlug: "women-in-business",
    authorIndex: 0,
    coverImage: "https://folio-one-lemon.vercel.app/issues/saj/cover.jpg",
    coverCredit: "Photograph courtesy SAJ Interior Design & Real Estate Services",
    tags: ["Real Estate", "Caribbean", "Luxury", "Women in Business", "Entrepreneurship"],
    format: "feature" as const,
    featured: true,
    daysAgo: 1,
    pullQuote: {
      text: "Always master the art of the deal.",
      attribution: "Shermel A. Jeffers Chandwani",
    },
    seoDescription:
      "A profile of Shermel A. Jeffers Chandwani — Managing Director of SAJ Interior Design & Real Estate Services, from the lending desk to a US$300M luxury portfolio in the Caribbean.",
    content: `<p>Thirteen years in banking. Ten in real estate. A portfolio now in excess of US$300 million — and a practice that still begins with a pre-approval, not a showing. Shermel A. Jeffers Chandwani leads SAJ Interior Designs and Real Estate Services from St. Kitts & Nevis, where the work is listings, yes, but also counsel: which bank, which product, which appointment, before a key turns in a lock.</p>
<p>A friend in the banking years put it plainly. She was great with people, and she could sell anything. She should do it. She did.</p>
<h2>From the lending desk to the listing</h2>
<p>As Managing Director of SAJ Interior Designs and Real Estate Services, Shermel leads a luxury consultancy on St. Kitts & Nevis. The work is not only listings. It is the unglamorous middle — mortgage introductions at the local banks, appointments booked, the financial picture made clear before anyone stands in a doorway.</p>
<p>The early years were the Royal Bank of Canada: top personal lending officer from 2005 to 2012, more than twenty-five Royal Performance awards in sales, locally and across the Eastern Caribbean. Then a friend said the obvious thing. She should sell. The island has been the proving ground ever since.</p>
<blockquote><p>Always master the art of the deal.</p><cite>Shermel A. Jeffers Chandwani</cite></blockquote>
<h2>What the awards actually mark</h2>
<p>2005–2012: Top Personal Lending Officer, RBC Royal Bank of Canada. More than 25 Royal Performance awards in sales. 2024 in New York: Best Luxury Boutique Real Estate Consultancy, St. Kitts & Nevis — Luxury Lifestyle Awards. Named among the Top 100 Real Estate Brokers of the World. 2025 in Switzerland: Leading Luxury Real Estate Consultancy for Personalized Investment Guidance — Global Elite Awards.</p>
<p>Coverage in CEO Magazine, EliteX, MSN, the New York Herald, and USA Today.</p>
<h2>If there is a deal to be made, make it</h2>
<p>SAJ's brief is complete: every detail of a client's real estate need, including the middle that luxury marketing usually skips. Which bank. Which product. Which appointment. Creativity here is not a mood board. It is a path through financing that actually closes.</p>
<p>The websites hold the listings. The practice holds the rest — empathy during the transaction and after it, and accurate information on every property in play. Ten years in, SAJ is a primary listing agent on the island, trusted by local banks to help liquidate foreclosed balances.</p>
<h2>The next five years</h2>
<p>She sees sales and new development rising — lifestyle buyers and Citizenship by Investment alike. The horizon she names for SAJ is not the island only, but the Caribbean region: a powerhouse broker, built the same way the first decade was built. To anyone who wants the work: it is not all glamour. Be focused. Know the market. Hear what the client actually needs. Stay determined to finish the task at hand.</p>`,
  },
  {
    title: "Inside the Caribbean Issue: A New Kind of Business Magazine",
    dek: "Our inaugural digital magazine profiles the dealmakers, builders, and quiet authorities who shape commerce in the Caribbean — starting with a woman who turned banking into real estate empire.",
    excerpt:
      "The first PrimeCrest digital magazine is live. Flip through The Caribbean Issue — an immersive, interactive reading experience.",
    categorySlug: "magazine",
    authorIndex: 0,
    coverImage: "https://folio-one-lemon.vercel.app/issues/saj/cover.jpg",
    coverCredit: "SAJ Interior Design & Real Estate Services",
    tags: ["Magazine", "Caribbean", "Digital Publishing", "Real Estate"],
    format: "feature" as const,
    featured: true,
    daysAgo: 1,
    seoDescription:
      "The first PrimeCrest digital magazine — The Caribbean Issue — is now live. An interactive flipbook featuring Shermel A. Jeffers Chandwani.",
    content: `<p>We are delighted to announce the launch of PrimeCrest's first digital magazine — <strong>The Caribbean Issue</strong>. This is not a PDF. It is an immersive, page-turning reading experience built for screens of every size, designed to feel like holding a print magazine while offering everything digital can.</p>
<h2>What's inside</h2>
<p>Our cover story profiles <strong>Shermel A. Jeffers Chandwani</strong>, Managing Director of SAJ Interior Design & Real Estate Services. From the Royal Bank of Canada's lending desk to a luxury consultancy with a portfolio exceeding US$300 million, her story is one of discipline, nerve, and an island that rewards people who know the difference between a showing and counsel.</p>
<p>The issue also explores the Caribbean's position as a destination for lifestyle buyers and Citizenship by Investment, the evolving luxury real estate landscape of St. Kitts & Nevis, and what it means to build a business where trust precedes the transaction.</p>
<h2>A new format for PrimeCrest</h2>
<p>The digital magazine is part of our commitment to offering journalism in the form that best serves each story. Some stories belong in a daily briefing. Some deserve a long, beautifully set reading experience with full-bleed photography, pull quotes, and room to breathe. The magazine is where those stories live.</p>
<p>Future issues will profile leaders, builders, and dealmakers across industries and geographies — always with the editorial rigour PrimeCrest readers expect, set in a format that respects their time and their taste.</p>`,
  },
];
