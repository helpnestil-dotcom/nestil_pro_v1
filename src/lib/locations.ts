export type Locality = {
  name: string;
};

export type District = {
  name: string;
  localities: Locality[];
};

export type State = {
  name: string;
  districts: District[];
};

// This static data is no longer the primary source for the location selector, 
// but can be kept as a fallback or for other purposes.
export const locationData: State[] = [
  {
    name: 'Karnataka',
    districts: [
      { name: 'Bangalore', localities: [{ name: 'Bellandur' }, { name: 'Koramangala' }, { name: 'Indiranagar' }, { name: 'HSR Layout' }, { name: 'Whitefield' }, { name: 'Electronic City' }] }
    ],
  }
];
