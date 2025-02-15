const PokemonShowdown = require('pokemon-showdown');
const Teams = PokemonShowdown.Teams;
const Dex = PokemonShowdown.Dex;
const fs = require('fs');
const bfjson = Object.create(null);

const noTera = false; // Set to true if Terastal Clause is active
const tier = 'ou';

let sets = fs.readFileSync('./sets.txt', 'utf8');

sets = sets.replaceAll('\r\n', '\n');

let setArr = sets.split('\n\n');

bfjson[tier] = {};

for (let i = 0; i < setArr.length; i++) {
  const curSet = Teams.import(setArr[i])[0];
  const curMon = Dex.species.get(curSet.species).id;
  if (!bfjson[tier][curMon]) {
    bfjson[tier][curMon] = {weight: 0, sets: []};
  }
  if (curSet.ability.includes('/')) {
    curSet.ability = curSet.ability.split('/').map(s => s.trim());
  }
  if (curSet.item.includes('/')) {
    curSet.item = curSet.item.split('/').map(s => s.trim());
  }
  for (let moveIndex = 0; moveIndex < curSet.moves.length; moveIndex++) {
    if (curSet.moves[moveIndex].includes('/')) {
      curSet.moves[moveIndex] = curSet.moves[moveIndex].split('/').map(s => s.trim());
    }
  }
  curSet.weight = 0;
  delete curSet.name;
  if (!curSet.gender) delete curSet.gender;
  if (curSet.level === 100) delete curSet.level;
  for (const ev of Object.keys(curSet.evs)) {
    if (curSet.evs[ev] === 0) delete curSet.evs[ev];
  }
  for (const iv of Object.keys(curSet.ivs)) {
    if (curSet.ivs[iv] === 31) delete curSet.ivs[iv];
  }
  if (!Object.keys(curSet.ivs).length) delete curSet.ivs;
  if (noTera) {
    if (curSet.teraType.includes('/')) {
      curSet.teraType = curSet.teraType.split('/').map(s => s.trim());
    }
  } else {
    delete curSet.teraType;
  }
  bfjson[tier][curMon].sets.push(curSet);
}

fs.writeFileSync(`factorysets${tier}.json`, JSON.stringify(bfjson));
