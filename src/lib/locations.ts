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
      { 
        name: 'Bangalore', 
        localities: [
          { name: 'Whitefield' }, { name: 'Marathahalli' }, { name: 'Bellandur' }, 
          { name: 'Sarjapur Road' }, { name: 'KR Puram' }, { name: 'BTM Layout' }, 
          { name: 'Jayanagar' }, { name: 'JP Nagar' }, { name: 'Electronic City' }, 
          { name: 'Bannerghatta Road' }, { name: 'Yelahanka' }, { name: 'Hebbal' }, 
          { name: 'Devanahalli' }, { name: 'Manyata Tech Park' }, { name: 'MG Road' }, 
          { name: 'Brigade Road' }, { name: 'Indiranagar' }, { name: 'Ulsoor' }, 
          { name: 'Rajajinagar' }, { name: 'Vijayanagar' }, { name: 'Yeshwanthpur' }, 
          { name: 'Hoskote' }
        ] 
      }
    ],
  }
];
