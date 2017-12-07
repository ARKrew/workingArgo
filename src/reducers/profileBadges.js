
// ===== Cannot dynamically render require =====

// const profileBadges = badges.map((badge) => {
//   let filePath = `./../assets/icons/${badge}`;
//   return (
//     {
//       name: badge,
//       image: require(filePath)
//     }
//   );
// });

const profileBadges = [
  {
    fileName: '001-parrot.png',
    image: require('./../assets/icons/001-parrot.png')
  },
  {
    fileName: '002-anchor.png',
    image: require('./../assets/icons/002-anchor.png')
  },
  {
    fileName: '003-helm.png',
    image: require('./../assets/icons/003-helm.png')
  },
  {
    fileName: '004-ship.png',
    image: require('./../assets/icons/004-ship.png')
  },
  {
    fileName: '005-dice.png',
    image: require('./../assets/icons/005-dice.png')
  },
  {
    fileName: '006-skull-1.png',
    image: require('./../assets/icons/006-skull-1.png')
  },
  {
    fileName: '007-pipe.png',
    image: require('./../assets/icons/007-pipe.png')
  },
  {
    fileName: '008-rum.png',
    image: require('./../assets/icons/008-rum.png')
  },
  {
    fileName: '009-wooden-leg.png',
    image: require('./../assets/icons/009-wooden-leg.png')
  },
  {
    fileName: '010-hook-1.png',
    image: require('./../assets/icons/010-hook-1.png')
  },
  {
    fileName: '011-sailor.png',
    image: require('./../assets/icons/011-sailor.png')
  },
  {
    fileName: '012-eyepatch.png',
    image: require('./../assets/icons/012-eyepatch.png')
  },
  {
    fileName: '013-pirate-hat.png',
    image: require('./../assets/icons/013-pirate-hat.png')
  },
  {
    fileName: '014-spyglass.png',
    image: require('./../assets/icons/014-spyglass.png')
  },
  {
    fileName: '015-musket.png',
    image: require('./../assets/icons/015-musket.png')
  },
  {
    fileName: '016-bomb.png',
    image: require('./../assets/icons/016-bomb.png')
  },
  {
    fileName: '017-skull.png',
    image: require('./../assets/icons/017-skull.png')
  },
  {
    fileName: '018-round-shot.png',
    image: require('./../assets/icons/018-round-shot.png')
  },
  {
    fileName: '019-cannon.png',
    image: require('./../assets/icons/019-cannon.png')
  },
  {
    fileName: '020-sabers.png',
    image: require('./../assets/icons/020-sabers.png')
  },
  {
    fileName: '021-hook.png',
    image: require('./../assets/icons/021-hook.png')
  },
  {
    fileName: '022-paddles.png',
    image: require('./../assets/icons/022-paddles.png')
  },
  {
    fileName: '023-chains.png',
    image: require('./../assets/icons/023-chains.png')
  },
  {
    fileName: '024-gallows.png',
    image: require('./../assets/icons/024-gallows.png')
  },
  {
    fileName: '025-torch.png',
    image: require('./../assets/icons/025-torch.png')
  },
  {
    fileName: '026-signal.png',
    image: require('./../assets/icons/026-signal.png')
  },
  {
    fileName: '027-coin.png',
    image: require('./../assets/icons/027-coin.png')
  },
  {
    fileName: '028-pirate-3.png',
    image: require('./../assets/icons/028-pirate-3.png')
  },
  {
    fileName: '029-key.png',
    image: require('./../assets/icons/029-key.png')
  },
  {
    fileName: '030-scroll.png',
    image: require('./../assets/icons/030-scroll.png')
  },
  {
    fileName: '031-money-bag.png',
    image: require('./../assets/icons/031-money-bag.png')
  },
  {
    fileName: '032-mug.png',
    image: require('./../assets/icons/032-mug.png')
  },
  {
    fileName: '033-boat.png',
    image: require('./../assets/icons/033-boat.png')
  },
  {
    fileName: '034-chest.png',
    image: require('./../assets/icons/034-chest.png')
  },
  {
    fileName: '035-barrel.png',
    image: require('./../assets/icons/035-barrel.png')
  },
  {
    fileName: '036-lifebuoy.png',
    image: require('./../assets/icons/036-lifebuoy.png')
  },
  {
    fileName: '037-porthole.png',
    image: require('./../assets/icons/037-porthole.png')
  },
  {
    fileName: '038-pirate-2.png',
    image: require('./../assets/icons/038-pirate-2.png')
  },
  {
    fileName: '039-pirate-1.png',
    image: require('./../assets/icons/039-pirate-1.png')
  },
  {
    fileName: '040-pirate-flag.png',
    image: require('./../assets/icons/040-pirate-flag.png')
  },
  {
    fileName: '041-ship-in-a-bottle.png',
    image: require('./../assets/icons/041-ship-in-a-bottle.png')
  },
  {
    fileName: '042-treasure-map.png',
    image: require('./../assets/icons/042-treasure-map.png')
  },
  {
    fileName: '043-compass-1.png',
    image: require('./../assets/icons/043-compass-1.png')
  },
  {
    fileName: '044-compass.png',
    image: require('./../assets/icons/044-compass.png')
  },
  {
    fileName: '045-message.png',
    image: require('./../assets/icons/045-message.png')
  },
  {
    fileName: '046-lighthouse.png',
    image: require('./../assets/icons/046-lighthouse.png')
  },
  {
    fileName: '047-island.png',
    image: require('./../assets/icons/047-island.png')
  },
  {
    fileName: '048-kraken.png',
    image: require('./../assets/icons/048-kraken.png')
  },
  {
    fileName: '049-whale.png',
    image: require('./../assets/icons/049-whale.png')
  },
  {
    fileName: '050-pirate.png',
    image: require('./../assets/icons/050-pirate.png')
  },
  {
    fileName: 'flag2.png',
    image: require('./../assets/icons/flag2.png')
  },
  {
    fileName: 'helm.png',
    image: require('./../assets/icons/helm.png')
  },
  {
    fileName: 'scroll.png',
    image: require('./../assets/icons/scroll.png')
  },
  {
    fileName: 'skull.png',
    image: require('./../assets/icons/skull.png')
  },
  {
    fileName: 'treasure-map.png',
    image: require('./../assets/icons/treasure-map.png')
  }
];

export default profileBadges;
