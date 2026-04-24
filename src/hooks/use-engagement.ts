
'use client';

import { useState, useEffect } from 'react';

const RECENTLY_VIEWED_KEY = 'nestil_recently_viewed';
const COMPARE_LIST_KEY = 'nestil_compare_list';

export function useEngagement() {
    const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
    const [compareList, setCompareList] = useState<string[]>([]);

    useEffect(() => {
        const rv = localStorage.getItem(RECENTLY_VIEWED_KEY);
        const cl = localStorage.getItem(COMPARE_LIST_KEY);
        if (rv) setRecentlyViewed(JSON.parse(rv));
        if (cl) setCompareList(JSON.parse(cl));
    }, []);

    const addToRecentlyViewed = (propertyId: string) => {
        setRecentlyViewed((prev) => {
            const newList = [propertyId, ...prev.filter(id => id !== propertyId)].slice(0, 10);
            localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newList));
            return newList;
        });
    };

    const toggleCompare = (propertyId: string) => {
        setCompareList((prev) => {
            let newList;
            if (prev.includes(propertyId)) {
                newList = prev.filter(id => id !== propertyId);
            } else {
                newList = [...prev, propertyId].slice(0, 3); // Max 3 for comparison
            }
            localStorage.setItem(COMPARE_LIST_KEY, JSON.stringify(newList));
            return newList;
        });
    };

    const clearCompare = () => {
        setCompareList([]);
        localStorage.removeItem(COMPARE_LIST_KEY);
    };

    return {
        recentlyViewed,
        compareList,
        addToRecentlyViewed,
        toggleCompare,
        clearCompare
    };
}
