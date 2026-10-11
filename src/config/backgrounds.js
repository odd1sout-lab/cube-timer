import mountains from '../assets/backgrounds/mountains.svg';
import aurora from '../assets/backgrounds/aurora.svg';
import dunes from '../assets/backgrounds/dunes.svg';
import bokeh from '../assets/backgrounds/bokeh.svg';
import forest from '../assets/backgrounds/forest.svg';

export const BACKGROUNDS = [
  { id: 'mountains', name: 'Mountains at Dawn', src: mountains },
  { id: 'aurora', name: 'Northern Lights', src: aurora },
  { id: 'dunes', name: 'Sunset over the Dunes', src: dunes },
  { id: 'bokeh', name: 'Night City', src: bokeh },
  { id: 'forest', name: 'Misty Forest', src: forest },
];

export const DEFAULT_BACKGROUND = 'mountains';
