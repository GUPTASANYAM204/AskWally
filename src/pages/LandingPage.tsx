import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchHero } from '../components/SearchHero';
import { FeatureGrid } from '../components/FeatureGrid';
import { ExampleQueries } from '../components/ExampleQueries';
import { parseQuery } from '../utils/queryParser';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const parsedQuery = parseQuery(query);
    
    // Navigate to products page with search results
    navigate('/products', { 
      state: { 
        query, 
        parsedQuery,
        searchPerformed: true 
      } 
    });
    
    setIsSearching(false);
  };

  return (
    <div className="pt-16 min-h-screen">
      <SearchHero onSearch={handleSearch} isSearching={isSearching} />
      <ExampleQueries onQueryClick={handleSearch} />
      <FeatureGrid />
    </div>
  );
};