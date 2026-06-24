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

export function useBirthdayCountup(birthDate: Date): { years: number; days: number; hours: number; minutes: number; seconds: number } {
  const [time, setTime] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - birthDate.getTime();
      
      const years = now.getFullYear() - birthDate.getFullYear();
      const yearStart = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      const dayOfYear = Math.floor((now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
      
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      setTime({ years, days: dayOfYear, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [birthDate]);

  return time;
}
