import { 
  Wifi, 
  Wind, 
  Car, 
  Shield, 
  Zap, 
  Tv, 
  Dumbbell, 
  Camera, 
  UtensilsCrossed, 
  Waves,
  Droplets,
  Layout,
  ShieldCheck,
  Leaf,
  ArrowUp,
  Dog,
  Thermometer,
  Brush,
  Snowflake,
  Gamepad2,
  Book,
  ArrowUpRight,
  Sofa,
  Bath
} from 'lucide-react';

export const AMENITY_ICONS: Record<string, any> = {
  // General
  'Balcony': Layout,
  'Borewell Water': Droplets,
  'Car Parking': Car,
  'CCTV': Camera,
  'Electricity': Zap,
  'Gated Community': ShieldCheck,
  'Garden': Leaf,
  'Gym': Dumbbell,
  'Lift': ArrowUp,
  'Municipal Water': Droplets,
  'Pets Allowed': Dog,
  'Power Backup': Zap,
  'Security': Shield,
  'Terrace Access': ArrowUpRight,
  
  // PG / Coliving
  'WiFi': Wifi,
  'RO Water': Droplets,
  'Hot Water': Thermometer,
  'Washing Machine': Waves,
  'Housekeeping': Brush,
  'Parking': Car,
  'AC': Wind,
  'TV': Tv,
  'Refrigerator': Snowflake,
  'Gaming Area': Gamepad2,
  'Common Kitchen': UtensilsCrossed,
  'Study Area': Book,
  'Terrace': ArrowUpRight,
  'Lounge Area': Sofa,
  
  // Inferred from flags
  'Attached Bathroom': Bath,
  'Electricity Included': Zap,
  'Food Included': UtensilsCrossed,
  'WiFi Included': Wifi,
  'Water Included': Droplets,
};

export const getAmenityIcon = (name: string) => {
  return AMENITY_ICONS[name] || Shield; // Default fallback
};

export const getAllPropertyAmenities = (property: any) => {
  const amenities = [...(property.amenities || [])];
  
  const isPG = property.listingFor === 'PG' || 
               property.propertyType?.includes('PG') || 
               property.propertyType?.includes('Hostel') || 
               property.propertyType?.includes('Co-living');

  // Add boolean flags as amenities if they are true
  if (property.attachedBathroom) amenities.push('Attached Bathroom');
  if (property.balcony) amenities.push('Balcony');
  
  // Only add PG-specific flags if it's a PG
  if (isPG) {
    if (property.electricityIncluded) amenities.push('Electricity Included');
    if (property.foodIncluded) amenities.push('Food Included');
    if (property.wifiIncluded) amenities.push('WiFi Included');
    if (property.waterIncluded) amenities.push('Water Included');
  }
  
  // Deduplicate
  return Array.from(new Set(amenities));
};
