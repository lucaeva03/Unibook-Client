import { test, expect, describe } from 'vitest';
import {
  convertTemperature,
  countVowels,
  clamp,
  fizzbuzz,
  longestWord,
  isPalindrome,
  applyDiscount,
  removeDuplicates,
  capitalizeWords,
  validatePassword,
} from './basics-homework.js';

// ---------------------------------------------------------------------------
// Esercizio 1 â€” convertTemperature
// ---------------------------------------------------------------------------
describe('convertTemperature', () => {
  test('converte 0Â°C in 32Â°F', () => {
    expect(convertTemperature(0, 'C')).toBe(32);
  });

  test('converte 100Â°C in 212Â°F', () => {
    expect(convertTemperature(100, 'C')).toBe(212);
  });

  test('converte temperature negative: -40Â°C â†’ -40Â°F', () => {
    expect(convertTemperature(-40, 'C')).toBe(-40);
  });

  test('converte 32Â°F in 0Â°C', () => {
    expect(convertTemperature(32, 'F')).toBe(0);
  });

  test('converte 98.6Â°F in 37Â°C', () => {
    expect(convertTemperature(98.6, 'F')).toBe(37);
  });

  test('restituisce null per unitÃ  non valida', () => {
    expect(convertTemperature(100, 'K')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Esercizio 2 â€” countVowels
// ---------------------------------------------------------------------------
describe('countVowels', () => {
  test('conta le vocali in una parola minuscola', () => {
    expect(countVowels('hello')).toBe(2);
  });

  test('conta le vocali case insensitive', () => {
    expect(countVowels('AEIOU')).toBe(5);
  });

  test('conta le vocali in una parola mista', () => {
    expect(countVowels('JavaScript')).toBe(3);
  });

  test('restituisce 0 per stringhe senza vocali', () => {
    expect(countVowels('bcdfg')).toBe(0);
  });

  test('restituisce 0 per stringa vuota', () => {
    expect(countVowels('')).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 3 â€” clamp
// ---------------------------------------------------------------------------
describe('clamp', () => {
  test('restituisce il valore invariato se Ã¨ dentro il range', () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });

  test('restituisce min se il valore Ã¨ troppo piccolo', () => {
    expect(clamp(-3, 0, 100)).toBe(0);
  });

  test('restituisce max se il valore Ã¨ troppo grande', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  test('restituisce min quando value === min', () => {
    expect(clamp(0, 0, 1)).toBe(0);
  });

  test('restituisce max quando value === max', () => {
    expect(clamp(1, 0, 1)).toBe(1);
  });

  test('funziona con numeri decimali', () => {
    expect(clamp(1.5, 0, 1)).toBe(1);
    expect(clamp(-0.1, 0, 1)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 4 â€” fizzbuzz
// ---------------------------------------------------------------------------
describe('fizzbuzz', () => {
  test('restituisce array corretto per n=5', () => {
    expect(fizzbuzz(5)).toEqual(['1', '2', 'Fizz', '4', 'Buzz']);
  });

  test('15 deve essere FizzBuzz', () => {
    const result = fizzbuzz(15);
    expect(result[14]).toBe('FizzBuzz');
  });

  test('3 deve essere Fizz', () => {
    expect(fizzbuzz(3)[2]).toBe('Fizz');
  });

  test('5 deve essere Buzz', () => {
    expect(fizzbuzz(5)[4]).toBe('Buzz');
  });

  test('la lunghezza dell\'array Ã¨ uguale a n', () => {
    expect(fizzbuzz(10).length).toBe(10);
  });

  test('tutti gli elementi sono stringhe', () => {
    const result = fizzbuzz(15);
    expect(result.every(el => typeof el === 'string')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 5 â€” longestWord
// ---------------------------------------------------------------------------
describe('longestWord', () => {
  test('trova la parola piÃ¹ lunga in una frase', () => {
    expect(longestWord('the quick brown fox')).toBe('quick');
  });

  test('in caso di paritÃ  restituisce la prima', () => {
    expect(longestWord('un due tre')).toBe('due');
  });

  test('funziona con una sola parola', () => {
    expect(longestWord('javascript')).toBe('javascript');
  });

  test('restituisce stringa vuota per input vuoto', () => {
    expect(longestWord('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Esercizio 6 â€” isPalindrome
// ---------------------------------------------------------------------------
describe('isPalindrome', () => {
  test('"racecar" Ã¨ un palindromo', () => {
    expect(isPalindrome('racecar')).toBe(true);
  });

  test('ignora maiuscolo/minuscolo e spazi', () => {
    expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
  });

  test('"hello" non Ã¨ un palindromo', () => {
    expect(isPalindrome('hello')).toBe(false);
  });

  test('una singola lettera Ã¨ sempre un palindromo', () => {
    expect(isPalindrome('a')).toBe(true);
  });

  test('"level" Ã¨ un palindromo', () => {
    expect(isPalindrome('level')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 7 â€” applyDiscount
// ---------------------------------------------------------------------------
describe('applyDiscount', () => {
  test('applica uno sconto del 20% su 100', () => {
    expect(applyDiscount(100, 20)).toBe(80);
  });

  test('arrotonda correttamente: 49.99 con sconto 10%', () => {
    expect(applyDiscount(49.99, 10)).toBe(44.99);
  });

  test('sconto 0% restituisce il prezzo pieno', () => {
    expect(applyDiscount(50, 0)).toBe(50);
  });

  test('sconto 100% restituisce 0', () => {
    expect(applyDiscount(100, 100)).toBe(0);
  });

  test('prezzo negativo restituisce null', () => {
    expect(applyDiscount(-10, 20)).toBeNull();
  });

  test('sconto superiore a 100 restituisce null', () => {
    expect(applyDiscount(100, 110)).toBeNull();
  });

  test('sconto negativo restituisce null', () => {
    expect(applyDiscount(100, -5)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Esercizio 8 â€” removeDuplicates
// ---------------------------------------------------------------------------
describe('removeDuplicates', () => {
  test('rimuove duplicati numerici', () => {
    expect(removeDuplicates([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  test('rimuove duplicati di stringhe', () => {
    expect(removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
  });

  test('restituisce array vuoto su input vuoto', () => {
    expect(removeDuplicates([])).toEqual([]);
  });

  test('array senza duplicati rimane invariato', () => {
    expect(removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('non modifica l\'array originale', () => {
    const original = [1, 1, 2];
    removeDuplicates(original);
    expect(original).toEqual([1, 1, 2]);
  });

  test('preserva l\'ordine di apparizione', () => {
    expect(removeDuplicates([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 9 â€” capitalizeWords
// ---------------------------------------------------------------------------
describe('capitalizeWords', () => {
  
});

// ---------------------------------------------------------------------------
// Esercizio 10 â€” validatePassword
// ---------------------------------------------------------------------------
describe('validatePassword', () => {
 
});