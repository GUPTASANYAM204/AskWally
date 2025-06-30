import React, { useState, useEffect } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth mounting
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const calculateStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: 'Enter password', color: '#9ca3af' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Determine strength level
    if (score <= 2) {
      return { score: Math.min(score, 4), label: 'Weak', color: '#ef4444' };
    } else if (score <= 4) {
      return { score: Math.min(score, 4), label: 'Fair', color: '#f59e0b' };
    } else if (score <= 6) {
      return { score: Math.min(score, 4), label: 'Good', color: '#10b981' };
    } else {
      return { score: 4, label: 'Strong', color: '#059669' };
    }
  };

  const strength = calculateStrength(password);
  const percentage = (strength.score / 4) * 100;

  return (
    <div className={`mt-2 transition-all duration-500 ease-in-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">Password strength:</span>
        <span 
          className="text-xs font-medium password-strength-text"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full password-strength-fill ${
            percentage > 0 && percentage < 100 ? 'animate-smooth-pulse' : ''
          }`}
          style={{
            width: `${percentage}%`,
            backgroundColor: strength.color,
            transform: percentage > 0 ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
          }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-500 transition-opacity duration-300">
        {!password && 'Start typing to see password strength'}
        {password && password.length < 6 && 'Add more characters'}
        {password && password.length >= 6 && strength.score <= 2 && 'Add uppercase, numbers, or symbols'}
        {password && strength.score >= 3 && 'Good password!'}
      </div>
    </div>
  );
}; 