import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

const metroCities = [
  { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80', activeUsers: '12K+' },
  { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=800&q=80', activeUsers: '8.5K+' },
  { name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', activeUsers: '6K+' },
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=800&q=80', activeUsers: '15K+' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', activeUsers: '10K+' },
];

export function FlatmateSection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_40%)] pointer-events-none"></div>
      
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-y-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-indigo-600 mb-4">
              <span className="w-5 h-0.5 bg-indigo-600 rounded-full"></span>Co-living & Flatmates
            </div>
            <h2 className="font-bold text-3xl md:text-5xl leading-tight tracking-tight text-slate-800">
              Find Your Vibe.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
                Share Your Space.
              </span>
            </h2>
            <p className="mt-4 text-slate-500 text-lg">
              Discover verified flatmates and co-living spaces in India's top metro cities.
            </p>
          </div>
          <Link 
            href="/properties?transaction=Rent&type=Flatmate+%2F+Co-living" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
          >
            Explore All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {metroCities.map((city, index) => (
            <Link 
              key={city.name}
              href={`/properties?keyword=${encodeURIComponent(city.name)}&type=Flatmate+%2F+Co-living&transaction=Rent`}
              className="group relative h-48 md:h-64 rounded-2xl md:rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 block transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image with overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${city.image}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex flex-col items-start text-white">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider uppercase mb-2 border border-white/20">
                  <MapPin className="w-3 h-3" /> Metro
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-1">{city.name}</h3>
                <p className="text-xs md:text-sm text-slate-300 font-medium">{city.activeUsers} Looking</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
