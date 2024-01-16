import * as fs from 'fs'

let raw = JSON.parse(fs.readFileSync('./public/raw.json', 'utf8'));

let links = {};
let finalData = {
  nodes: [],
  links: [],
};
let strippedData = {
  nodes: [],
  links: [],
}

let nameNumDict = {};

//adding root nodes for those that don't exist
Object.keys(raw).forEach((key) => {
  raw[key].map((s) => s.toLowerCase()).forEach((val) => {
    if (!raw[val]) raw[val] = [];
  })
})

Object.keys(raw).forEach((key, i) => {
  const keyLower = key.toLowerCase();

  nameNumDict[keyLower] = i; //for data stripping

  finalData.nodes.push({ id: keyLower, num: nameNumDict[keyLower] });
  strippedData.nodes.push({ id: nameNumDict[keyLower] });

  raw[key].map((s) => s.toLowerCase()).forEach((link) => {
    const linkKeys = [keyLower, link].sort();

    links[linkKeys.join(':')] = ''; //janky, but functional, to ensure links arent duplicated
  })
})

Object.keys(links).forEach((link) => {
  const linkItems = link.split(':');
  finalData.links.push({
    source: linkItems[0],
    target: linkItems[1],
    value: 2,
  })
  strippedData.links.push({
    source: nameNumDict[linkItems[0]],
    target: nameNumDict[linkItems[1]],
    value: 2,
  })
})

fs.writeFileSync('./public/full.json', JSON.stringify(finalData));
fs.writeFileSync('./public/stripped.json', JSON.stringify(strippedData));