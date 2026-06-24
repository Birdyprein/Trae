import { useState, useEffect } from 'react';

export function useAge(birthDate: Date): number {
  const [age, setAge] = useState(0);

  useEffect(() => {
    const calculateAge = () => {
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      setAge(calculatedAge);
    };

    calculateAge();
  }, [birthDate]);

  return age;
}

export function useDaysUntilBirthday(birthDate: Date): number {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const today = new Date();
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (today > thisYearBirthday) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = thisYearBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDays(diffDays);
  }, [birthDate]);

  return days;
}

export function useBirthdayCountup(startDate: Date): { years: number; days: number; hours: number; minutes: number; seconds: number } {
  const [time, setTime] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();
      
      let remaining = diffMs;
      
      const years = Math.floor(remaining / (1000 * 60 * 60 * 24 * 365.25));
      remaining -= years * (1000 * 60 * 60 * 24 * 365.25);
      
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      remaining -= days * (1000 * 60 * 60 * 24);
      
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      remaining -= hours * (1000 * 60 * 60);
      
      const minutes = Math.floor(remaining / (1000 * 60));
      remaining -= minutes * (1000 * 60);
      
      const seconds = Math.floor(remaining / 1000);
      
      setTime({ years, days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return time;
}
