import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        // Load favorites from localStorage
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        // Persist favorites to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (documentId) => {
        setFavorites(prev => {
            if (!prev.includes(documentId)) {
                return [...prev, documentId];
            }
            return prev;
        });
    };

    const removeFavorite = (documentId) => {
        setFavorites(prev => prev.filter(id => id !== documentId));
    };

    const toggleFavorite = (documentId) => {
        if (favorites.includes(documentId)) {
            removeFavorite(documentId);
        } else {
            addFavorite(documentId);
        }
    };

    const isFavorite = (documentId) => {
        return favorites.includes(documentId);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addFavorite,
            removeFavorite,
            toggleFavorite,
            isFavorite
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};
