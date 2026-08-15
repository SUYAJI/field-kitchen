export type Region = 'Willamette Valley' | 'Puget Sound' | 'Olympic Peninsula' | 'Cascade Range';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type SourceLayer = 'Local' | 'Regional' | 'Imported' | 'Wild Foraged';
export type PrepMethod = 'Raw' | 'Roasted' | 'Fermented' | 'Simmered' | 'Steamed' | 'Pickled' | 'Ground' | 'Soaked';

export interface Ingredient {
  id: string;
  name: string;
  color: string;
  image: string;
  seasons: Season[];
  region: Region[];
  originTag: string;
  nutrientDensity: number; // 1-10
  preparations: PrepMethod[];
  harvestWindow: [number, number]; // 0-11 for Jan-Dec
  pairings: string[];
  localPriority: 'High' | 'Medium' | 'Low';
  sourceLayer: SourceLayer;
  nutrients: {
    protein: number; // 1-100
    mineral: number;
    fiber: number;
    digestibility: number;
  };
}

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'chanterelle',
    name: 'Chanterelle',
    color: '#e9c46a',
    image: 'https://images.unsplash.com/photo-1760891961393-e6ab0dc820e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFudGVyZWxsZSUyMG11c2hyb29tJTIwZm9yYWdlfGVufDF8fHx8MTc3NjQ2Njg4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    seasons: ['Autumn'],
    region: ['Cascade Range', 'Olympic Peninsula'],
    originTag: 'Forest Floor',
    nutrientDensity: 8,
    preparations: ['Roasted', 'Simmered', 'Steamed'],
    harvestWindow: [8, 10], // Sept - Nov
    pairings: ['Douglas Fir', 'Hazelnut', 'Walla Walla Onion'],
    localPriority: 'High',
    sourceLayer: 'Wild Foraged',
    nutrients: { protein: 45, mineral: 75, fiber: 35, digestibility: 70 },
  },
  {
    id: 'huckleberry',
    name: 'Huckleberry',
    color: '#6a0572',
    image: 'https://images.unsplash.com/photo-1575679483854-4a651f4bc7f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkJTIwaHVja2xlYmVycnl8ZW58MXx8fHwxNzc2NDY2ODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    seasons: ['Summer', 'Autumn'],
    region: ['Cascade Range', 'Olympic Peninsula'],
    originTag: 'Subalpine Scrub',
    nutrientDensity: 9,
    preparations: ['Raw', 'Simmered', 'Fermented'],
    harvestWindow: [7, 9], // Aug - Oct
    pairings: ['Douglas Fir', 'Hazelnut', 'Rhubarb'],
    localPriority: 'High',
    sourceLayer: 'Wild Foraged',
    nutrients: { protein: 5, mineral: 50, fiber: 85, digestibility: 95 },
  },
  {
    id: 'fiddlehead',
    name: 'Fiddlehead Fern',
    color: '#2a9d8f',
    image: 'https://images.unsplash.com/photo-1592018525569-95f358a7cc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWRkbGVoZWFkJTIwZmVybnxlbnwxfHx8fDE3NzY0NjY4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    seasons: ['Spring'],
    region: ['Puget Sound', 'Olympic Peninsula'],
    originTag: 'Riparian Zone',
    nutrientDensity: 7,
    preparations: ['Steamed', 'Roasted', 'Pickled'],
    harvestWindow: [3, 4], // April - May
    pairings: ['Chanterelle', 'Walla Walla Onion', 'Hazelnut'],
    localPriority: 'High',
    sourceLayer: 'Wild Foraged',
    nutrients: { protein: 30, mineral: 85, fiber: 60, digestibility: 65 },
  },
  {
    id: 'hazelnut',
    name: 'Filbert Hazelnut',
    color: '#bc6c25',
    image: 'https://images.unsplash.com/photo-1715861696705-67ccf052baf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXclMjBoYXplbG51dHN8ZW58MXx8fHwxNzc2NDY2ODg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    seasons: ['Autumn', 'Winter'],
    region: ['Willamette Valley'],
    originTag: 'Valley Orchard',
    nutrientDensity: 10,
    preparations: ['Roasted', 'Ground', 'Raw'],
    harvestWindow: [8, 10], // Sept - Nov
    pairings: ['Huckleberry', 'Chanterelle', 'Rhubarb'],
    localPriority: 'High',
    sourceLayer: 'Local',
    nutrients: { protein: 75, mineral: 80, fiber: 70, digestibility: 85 },
  },
  {
    id: 'walla-walla',
    name: 'Walla Walla Onion',
    color: '#f4e285',
    image: 'https://images.unsplash.com/photo-1741517480859-cc010cff7e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VldCUyMG9uaW9uJTIwZmFybXxlbnwxfHx8fDE3NzY0NjY4ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    seasons: ['Summer'],
    region: ['Willamette Valley'],
    originTag: 'Volcanic Soil',
    nutrientDensity: 6,
    preparations: ['Raw', 'Roasted', 'Pickled'],
    harvestWindow: [5, 7], // June - Aug
    pairings: ['Chanterelle', 'Fiddlehead', 'Bull Kelp'],
    localPriority: 'High',
    sourceLayer: 'Local',
    nutrients: { protein: 10, mineral: 40, fiber: 20, digestibility: 90 },
  },
  {
    id: 'rhubarb',
    name: 'Rhubarb',
    color: '#d62828',
    image: 'https://images.unsplash.com/photo-1694402612127-70338cd7e458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHJodWJhcmJ8ZW58MXx8fHwxNzc2NDY2ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    seasons: ['Spring', 'Summer'],
    region: ['Puget Sound', 'Willamette Valley'],
    originTag: 'Cool Soil',
    nutrientDensity: 7,
    preparations: ['Simmered', 'Roasted', 'Fermented'],
    harvestWindow: [3, 6], // April - July
    pairings: ['Huckleberry', 'Hazelnut', 'Douglas Fir'],
    localPriority: 'High',
    sourceLayer: 'Local',
    nutrients: { protein: 15, mineral: 60, fiber: 80, digestibility: 75 },
  },
  {
    id: 'douglas-fir',
    name: 'Douglas Fir Tips',
    color: '#606c38',
    image: 'https://images.unsplash.com/photo-1636531370203-a6f3d331be57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb3VnbGFzJTIwZmlyJTIwYnJhbmNoZXN8ZW58MXx8fHwxNzc2NDY2ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    seasons: ['Spring'],
    region: ['Cascade Range', 'Olympic Peninsula'],
    originTag: 'Canopy Layer',
    nutrientDensity: 8,
    preparations: ['Raw', 'Pickled', 'Soaked'],
    harvestWindow: [3, 4], // April - May
    pairings: ['Huckleberry', 'Chanterelle', 'Rhubarb'],
    localPriority: 'Medium',
    sourceLayer: 'Wild Foraged',
    nutrients: { protein: 5, mineral: 90, fiber: 30, digestibility: 60 },
  },
  {
    id: 'bull-kelp',
    name: 'Bull Kelp',
    color: '#283618',
    image: 'https://images.unsplash.com/photo-1598296689238-966b19ef4cae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWxsJTIwa2VscCUyMHNlYXdlZWR8ZW58MXx8fHwxNzc2NDY2ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    seasons: ['Summer', 'Autumn'],
    region: ['Olympic Peninsula', 'Puget Sound'],
    originTag: 'Coastal Tide',
    nutrientDensity: 9,
    preparations: ['Pickled', 'Raw', 'Simmered'],
    harvestWindow: [5, 9], // June - Oct
    pairings: ['Walla Walla Onion', 'Fiddlehead', 'Hazelnut'],
    localPriority: 'High',
    sourceLayer: 'Wild Foraged',
    nutrients: { protein: 35, mineral: 95, fiber: 50, digestibility: 85 },
  }
];
