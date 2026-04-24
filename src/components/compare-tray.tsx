
'use client';

import React from 'react';
import { useEngagement } from '@/hooks/use-engagement';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, documentId } from 'firebase/firestore';
import { Property } from '@/lib/types';
import { X, GitCompare, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function CompareTray() {
    const { compareList, toggleCompare, clearCompare } = useEngagement();
    const firestore = useFirestore();

    const clQuery = useMemoFirebase(() => {
        if (!firestore || compareList.length === 0) return null;
        return query(
            collection(firestore, 'properties'),
            where(documentId(), 'in', compareList)
        );
    }, [firestore, compareList]);

    const { data: properties } = useCollection<Property>(clQuery);

    return (
        <AnimatePresence>
            {compareList.length > 0 && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
                >
                    <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[24px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                            <GitCompare className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 flex gap-3 overflow-x-auto hide-scrollbar">
                            {compareList.map((id) => {
                                const prop = properties?.find(p => p.id === id);
                                return (
                                    <div key={id} className="relative group flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                                        {prop?.photos?.[0] ? (
                                            <img src={prop.photos[0]} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800" />
                                        )}
                                        <button 
                                            onClick={() => toggleCompare(id)}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                );
                            })}
                            {[...Array(3 - compareList.length)].map((_, i) => (
                                <div key={i} className="flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20">
                                    <span className="text-xs font-bold">{compareList.length + i + 1}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={clearCompare}
                                className="h-12 w-12 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl"
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                            <Link href={`/compare?ids=${compareList.join(',')}`}>
                                <Button 
                                    disabled={compareList.length < 2}
                                    className="bg-white hover:bg-slate-100 text-black font-black px-6 h-12 rounded-2xl flex items-center gap-2"
                                >
                                    Compare <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
