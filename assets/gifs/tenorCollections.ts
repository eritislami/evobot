export function getGif(catergory: string): string {
	const gifArray = gifArrays[catergory as keyof typeof gifArrays];

	if (!gifArray) return getRandomElm(gifArrays.meme);

	return getRandomElm(gifArray);
}

export function getReactionGif(catergory: string) {
	const gifArray = reactionGifArrays[catergory as keyof typeof reactionGifArrays];

	if (!gifArray) return getRandomElm(gifArrays.meme);

	return getRandomElm(gifArray);
}

function getRandomElm(arrayIn: string[]): string {
	return arrayIn[Math.floor(arrayIn.length * Math.random())];
}

const gifArrays = {
	gng: [
		'https://media.tenor.com/WJnj5U-LQ5wAAAAd/gng-goodnight-gaming.gif',
		'https://media.tenor.com/bmjAMlIebjAAAAAC/ascent-gaming-good-night.gif',
		'https://media.tenor.com/mJ21-8lByRkAAAAd/would-you-rather-unlimited-bacon-and-no-games-or-unlimited-games-but-no-games-goodnight.gif',
		'https://tenor.com/view/goodnight-lucy-hollow-knight-hollow-knight-headphones-new-headphones-gamer-gif-26381751',
		'https://media.tenor.com/cNep3ZQn4mEAAAAd/yakuza-phone.gif',
		'https://media.tenor.com/aEbvRscqoSkAAAAd/minecraft.gif',
		'https://media.tenor.com/hoG1tXql0_4AAAAd/good-night-good-night-gamers.gif',
		'https://media.tenor.com/mmuXcnCG8c4AAAAC/hollow-knight-game.gif',
		'https://media.tenor.com/CgZS4h8P2CoAAAAd/froz-broz-taihou-roblox.gif',
		'https://media.tenor.com/FrYRtel6Ve8AAAAd/yakuza-yakuza0.gif',
		'https://media.tenor.com/Udkrp6aAe5EAAAAd/goodnight-lucy-goodnight.gif',
		'https://media.tenor.com/BfqCwwONT8YAAAAC/goodnight-lucy-game-jam.gif',
		'https://media.tenor.com/wSN_TdduI3QAAAAC/beddie.gif',
		'https://media.tenor.com/83zrGMT_EDMAAAAd/goodnightdumdumdum.gif',
		'https://media.tenor.com/UelKlJRcooIAAAAC/good-night-gn.gif',
		'https://media.tenor.com/eGoYbHltsYwAAAAd/roblox-in-general-gamers-yoni-blood-kamakhya-temple.gif',
		'https://media.tenor.com/1D56WxDzGskAAAAC/pandam-fbacc.gif',
		'https://media.tenor.com/b7wpI6R_S6MAAAAC/goodnight-lucy-goodnight-dylan.gif',
		'https://media.tenor.com/tw11FMJ8DYAAAAAC/goodnight-sleep.gif',
		'https://media.tenor.com/lpAArBAEwogAAAAC/good-night-meme.gif',
		'https://media.tenor.com/1dHysnfTEo0AAAAd/goodnight-fellas-kirby.gif',
		'https://media.tenor.com/jpDaQkAcIskAAAAC/oxriyt-roblox.gif',
		'https://media.tenor.com/1cnO5J4W7GoAAAAd/gn-good-night.gif',
		'https://media.tenor.com/Q6NnF1gxjdoAAAAd/gn.gif',
		'https://media.tenor.com/-ECq5KYqrGMAAAAd/nyan-cat-guys.gif',
		'https://media.tenor.com/M8ctbecXgScAAAAd/serious-gamers-gsc.gif',
		'https://tenor.com/view/valorant-valorant-neon-neon-riot-games-decorating-gif-24654846',
		'https://media.tenor.com/nuDbWlEnj48AAAAd/good-night-chat-a-mimir-kratos.gif',
		'https://media.tenor.com/IiZMU1UamPoAAAAd/good-night-gn-chat.gif',
	],

	gmg: [
		'https://media.tenor.com/x7sADu7D01YAAAAC/gmg-good-morning-gaming-gamer-crew.gif',
		'https://media.tenor.com/TMYeEQWWPW4AAAAC/gaming-dojo-morning.gif',
		'https://media.tenor.com/cyHiL4ejm6oAAAAC/le-gamers.gif',
		'https://media.tenor.com/ccXPwXNuICsAAAAd/would-you-rather-unlimited-bacon-and-no-games-or-unlimited-games-but-no-games-good-morning.gif',
		'https://media.tenor.com/GcfteEoS3L0AAAAd/ldshadowlady-empires-smp.gif',
		'https://media.tenor.com/C6r66aa2vJwAAAAd/good-morning-good-morning-gamers.gif',
		'https://media.tenor.com/Hm3cq4gVNMwAAAAC/good-morning-hollow-knight.gif',
		'https://media.tenor.com/Jq45_9H90tgAAAAd/medic-tf2.gif',
		'https://media.tenor.com/I1dUtE_dq58AAAAd/pewdiepie-good-morning-gamers.gif',
		'https://media.tenor.com/Z5arsMPur9UAAAAC/good-morning-gamer.gif',
		'https://media.tenor.com/aZBo29G9KSUAAAAC/good-morning-good-morning-gaming-server.gif',
		'https://media.tenor.com/ZwKQ34jC_zUAAAAd/good-morning-good-morning-vibetribe.gif',
		'https://media.tenor.com/0Lph4oToEsoAAAAC/nygiants-ny.gif',
		'https://media.tenor.com/qfbGOPkpq0gAAAAC/ascent-gaming.gif',
		'https://media.tenor.com/l1uGFt2jehwAAAAC/mekatok-gaming-morning.gif',
		'https://media.tenor.com/_rvx0Ysd2N4AAAAC/funny-good-morning-bitches.gif',
		'https://media.tenor.com/3RFAOPnkb0oAAAAC/spaghetti-good-morning.gif',
		'https://media.tenor.com/cvq3Jek1CQgAAAAC/good-morning-dancing.gif',
		'https://media.tenor.com/shFvOeSF8dEAAAAC/omori-omori-kel.gif',
		'https://media.tenor.com/unxAuH3m0vwAAAAd/rtfkt-nft.gif',
		'https://media.tenor.com/rVvc-PdZ_hsAAAAC/gm-chat-hello-chat.gif',
		'https://media.tenor.com/OH5Vd-yZHrUAAAAC/good-morning-skeleton-meme.gif',
		'https://media.tenor.com/5C0XNC-9FqgAAAAd/good-morning-haha.gif',
		'https://media.tenor.com/GDI6GU1HftUAAAAd/ducko-genshin.gif',
	],

	gag: [
		'https://media.tenor.com/t-DrVYBfREAAAAAd/raiden-metal-gear-rising.gif',
		'https://media.tenor.com/DAOdhSNGwIgAAAAC/good-afternoon-ascent-gaming.gif',
		'https://media.tenor.com/bxogH_zdN4gAAAAd/hollow-knight-game.gif',
		'https://media.tenor.com/NqTi8SchSFkAAAAC/good-afternoon-everybody-trevor-mcneal.gif',
		'https://media.tenor.com/6XVBumY0Z-wAAAAC/goodafternoon-kevin.gif',
		'https://media.tenor.com/GzJ4fnlYrkcAAAAC/good-afternoon-max-whitby.gif',
		'https://media.tenor.com/m7NNg-UnFSYAAAAC/good-afternoon.gif',
		'https://media.tenor.com/lS_kTK0pySgAAAAd/subsidiary-tojo-clan.gif',
		'https://media.tenor.com/YmE_L6FPNDMAAAAC/awesome-get-to-work.gif',
		'https://media.tenor.com/3Pmig3kT93MAAAAC/simba-rafiki.gif',
	],

	geg: [
		'https://media.tenor.com/PD5h5Un5fR0AAAAd/good-evening-yakuza0.gif',
		'https://media.tenor.com/9Hw6fTe055QAAAAC/evening-good-evening.gif',
		'https://media.tenor.com/v6sd7dK9RPcAAAAC/hannah-montana-good-evening.gif',
		'https://media.tenor.com/sV4G638n-dQAAAAd/goose-evening-goose.gif',
		'https://media.tenor.com/c_6gz3o3cvgAAAAd/cat-good-evening.gif',
		'https://media.tenor.com/DFv1yGqK_RcAAAAd/good-evening-cat-breakdancing.gif',
		'https://media.tenor.com/-xOnYwLYh70AAAAd/good-evening-everyone-saturday-night-live.gif',
		'https://media.tenor.com/ECpRG1jAuuQAAAAC/good-evening-good-night.gif',
		'https://media.tenor.com/BNLCH0fyO4sAAAAC/good-evening-beer.gif',
		'https://media.tenor.com/DQxwt3H-MdMAAAAC/evening-vec50.gif',
		'https://media.tenor.com/f6gc_X7Vx9AAAAAC/good-ebening-good-evening.gif',
		'https://media.tenor.com/hCMFQZG6X7gAAAAC/have-a-great-evening-candles.gif',
	],

	meme: [
		'https://media.tenor.com/rtKFHEGpoPwAAAAd/meme-lang.gif',
		'https://media.tenor.com/CK9cb79aDWEAAAAC/thisbrokemyfinalbraincell.gif',
		'https://media.tenor.com/lqdVOKiQPQgAAAAd/promoted-discord-mod.gif',
		'https://media.tenor.com/ISis-MRIRyQAAAAC/blippi-blippi-meme.gif',
		'https://media.tenor.com/XEP6C1Ds66gAAAAd/kumala-la.gif',
		'https://media.tenor.com/BDFR4VGu_R0AAAAd/nok-nok-penguin-nook-nook.gif',
		'https://media.tenor.com/t3f2jHhItS8AAAAC/discord-mod-discord-mods.gif',
		'https://media.tenor.com/mLvVi_npPn4AAAAC/among-us-sus-among-us.gif',
		'https://media.tenor.com/h2eXJ8I15kgAAAAC/cringe-meme.gif',
		'https://media.tenor.com/O2A_n_UNGgQAAAAd/animals-dance.gif',
		'https://media.tenor.com/XTyMxI_cHTkAAAAd/rick-roll.gif',
	],

	ihm: [
		'https://media.tenor.com/laiIY5qtMYsAAAAC/garfield-happy-monday.gif',
		'https://media.tenor.com/AwxkO8uBqYIAAAAC/grumpy-its-monday.gif',
		'https://media.tenor.com/Sh2tkczs0MkAAAAC/garfield-i-hate-mondays.gif',
		'https://media.tenor.com/tbz9sC_Btq0AAAAd/monday-monday-again.gif',
		'https://media.tenor.com/LSfm2Zp7PRcAAAAd/garfield-mondays.gif',
		'https://media.tenor.com/g4tX71wLqWkAAAAC/happy-monday-garfield.gif',
		'https://media.tenor.com/XghcYIQ28J4AAAAC/mondays.gif',
		'https://media.tenor.com/TEBI-7FtSi0AAAAd/im-just-a-social-chameleon-garfield.gif',
		'https://media.tenor.com/heatlbJfz24AAAAd/im-beginning-to-dread-mondays-garfield.gif',
	],

	notMonday: [
		'https://media.tenor.com/hijm3GyMJg4AAAAC/kermit-funny.gif',
		'https://media.tenor.com/VgnPDqd4T5oAAAAC/cali006.gif',
		'https://media.tenor.com/5q3mTVVBe80AAAAC/when-its-not-monday-austin.gif',
		'https://media.tenor.com/hyn_Zcc6hrAAAAAC/well-at-least-mondays-over-garfield.gif',
		'https://media.tenor.com/MvIUtkR1n_MAAAAd/everyday-monday-garfield.gif',
		'https://media.tenor.com/GZM4VNRAElkAAAAd/happy-lol.gif',
	],

	brbg: [
		'https://media.tenor.com/xi82gpLUosUAAAAC/moment-be-right-back.gif',
		'https://media.tenor.com/UVvvmfO_DGcAAAAC/ill-be-right-back-randy-marsh.gif',
		'https://media.tenor.com/kJ3utzlq9VoAAAAC/fortnite-well-be-right-back.gif',
		'https://media.tenor.com/y-KWzhqSUcoAAAAC/brb.gif',
		'https://media.tenor.com/WZEa-jSB71UAAAAC/superman-ill-be-right-back.gif',
		'https://media.tenor.com/Tpm3JSbDVGQAAAAC/we-ll-be-right-back-right-back.gif',
		'https://media.tenor.com/Fct3VuEHQhcAAAAC/brb-be-right-back.gif',
		'https://media.tenor.com/0ZKUKd72qdwAAAAd/brb.gif',
		'https://media.tenor.com/kNx0nAxJ7dcAAAAC/be-right-back-brb.gif',
		'https://media.tenor.com/Vh6RfSdDpbgAAAAC/discord-vc.gif',
	],
};

const reactionGifArrays = {
	cringe: [
		'https://media.tenor.com/nHvbtHaIQ0gAAAAC/dies-from-cringe-meme.gif',
		'https://media.tenor.com/WarZqLGgTHoAAAAC/oh-no-cringe-cringe.gif',
		'https://media.tenor.com/OICW0AYLp0kAAAAd/cringe.gif',
		'https://media.tenor.com/EEqbeL495EkAAAAC/cringe.gif',
		'https://media.tenor.com/k-nerLrwH7UAAAAC/dies-from-cringe-dies-of-cringe.gif',
		'https://media.tenor.com/BkPe2712is8AAAAC/cringe-meme.gif',
		'https://media.tenor.com/UV6_Q8atJwwAAAAC/dies-from-cringe-pink.gif',
		'https://media.tenor.com/niiGncXqUgoAAAAC/cringe.gif',
		'https://media.tenor.com/P3sAVqFcbJsAAAAC/finding-nemo-cringe.gif',
		'https://media.tenor.com/CMjPoq8VZ7oAAAAC/pov-meme-ishowspeed.gif',
		'https://media.tenor.com/GoPVjDWYGqcAAAAd/cringe-garfield.gif',
		'https://media.tenor.com/sGc3oHMNSDgAAAAd/meme-cringe.gif',
	],

	react: [
		'https://media.tenor.com/fZaPPcOXvNwAAAAd/patrick-bateman.gif',
		'https://media.tenor.com/HOSEEuAweyAAAAAd/my-honest-reaction-the-rock-shock.gif',
		'https://media.tenor.com/P5B6lbpzwuQAAAAC/yh.gif',
		'https://media.tenor.com/KfGDR28nTNMAAAAd/my-honest.gif',
		'https://media.tenor.com/rdvD3NPg41wAAAAd/my-honest-reaction-my.gif',
		'https://media.tenor.com/lmtu6lOVZbkAAAAd/breaking-bad.gif',
		'https://media.tenor.com/cRgYyP1d2DEAAAAd/my-reaction-to-that-information-my-reaction-to-that-information-meme.gif',
		'https://media.tenor.com/Wu5tp_gOmuYAAAAd/my-honest-reaction-honest-reaction.gif',
		'https://media.tenor.com/fDpqMmvc57oAAAAd/my-honest-reaction-my-honest-reaction-meme.gif',
		'https://media.tenor.com/3yuTJ7S5yeQAAAAC/my-honest-reaction-my-honest-reaction-meme.gif',
		'https://media.tenor.com/LIVy5k8BgT8AAAAd/my-honest-reaction-my-honest-reaction-meme.gif',
		'https://media.tenor.com/SVnDrk8zLt8AAAAC/dawg-reaction.gif',
		'https://media.tenor.com/2Qu-DI6VHIAAAAAd/oldschoolrobloxdisaster-my-reaction-to-that-information.gif',
		'https://media.tenor.com/Dse0ud4BjQkAAAAd/reaction-informtaion.gif',
	],
};
