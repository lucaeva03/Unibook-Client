/**
 * Esercizio 1 â€” Convertitore di temperatura
 *
 * Scrivi una funzione `convertTemperature(value, unit)` che converte
 * una temperatura tra Celsius e Fahrenheit.
 *
 * - Se `unit` Ã¨ `'C'`, converti il valore da Celsius a Fahrenheit.
 * - Se `unit` Ã¨ `'F'`, converti il valore da Fahrenheit a Celsius.
 *
 * Formule:
 *   Â°F = Â°C * 9/5 + 32
 *   Â°C = (Â°F - 32) * 5/9
 *
 * Arrotonda il risultato a due decimali.
 * Se `unit` non Ã¨ nÃ© 'C' nÃ© 'F', restituisci `null`.
 *
 * Esempi:
 *   convertTemperature(0, 'C')   â†’ 32
 *   convertTemperature(100, 'C') â†’ 212
 *   convertTemperature(32, 'F')  â†’ 0
 *   convertTemperature(98.6, 'F') â†’ 37
 */
export function convertTemperature(value, unit) {
  if (unit === 'C') {
    return Math.round((value * 9 / 5 + 32) * 100) / 100;
  }

  if (unit === 'F') {
    return Math.round(((value - 32) * 5 / 9) * 100) / 100;
  }

  return null;
}

/**
 * Esercizio 2 â€” Conta le vocali
 *
 * Scrivi una funzione `countVowels(str)` che restituisce il numero
 * di vocali presenti nella stringa `str` (case insensitive).
 *
 * Considera vocali: a, e, i, o, u
 *
 * Esempi:
 *   countVowels("hello")          â†’ 2
 *   countVowels("JavaScript")     â†’ 3
 *   countVowels("AEIOU")          â†’ 5
 *   countVowels("bcdfg")          â†’ 0
 *   countVowels("")               â†’ 0
 */
export function countVowels(str) {
  const vowels = 'aeiou';
  let count = 0;

  for (const char of str.toLowerCase()) {
    if (vowels.includes(char)) {
      count++;
    }
  }

  return count;
}

/**
 * Esercizio 3 â€” Limita un valore (clamp)
 *
 * Scrivi una funzione `clamp(value, min, max)` che restituisce `value`
 * limitato all'intervallo [min, max]:
 * - Se `value` Ã¨ minore di `min`, restituisce `min`.
 * - Se `value` Ã¨ maggiore di `max`, restituisce `max`.
 * - Altrimenti restituisce `value` invariato.
 *
 * Questa funzione Ã¨ molto usata in ambito UI e animazioni per limitare
 * valori come l'opacitÃ  (0â€“1) o la posizione di un cursore.
 *
 * Esempi:
 *   clamp(5, 1, 10)   â†’ 5
 *   clamp(-3, 0, 100) â†’ 0
 *   clamp(150, 0, 100) â†’ 100
 *   clamp(0, 0, 1)    â†’ 0
 */
export function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Esercizio 4 â€” FizzBuzz
 *
 * Scrivi una funzione `fizzbuzz(n)` che restituisce un array di stringhe
 * per i numeri da 1 a `n` (incluso) seguendo queste regole:
 * - Multipli di 3: "Fizz"
 * - Multipli di 5: "Buzz"
 * - Multipli sia di 3 che di 5: "FizzBuzz"
 * - Tutti gli altri: il numero convertito in stringa (es. "1", "2")
 *
 * Il FizzBuzz Ã¨ un classico esercizio di selezione impiegato anche
 * nei colloqui tecnici per testare la comprensione dei condizionali.
 *
 * Esempi:
 *   fizzbuzz(5)  â†’ ["1", "2", "Fizz", "4", "Buzz"]
 *   fizzbuzz(15) â†’ [..., "FizzBuzz"]  // l'ultimo elemento
 */
export function fizzbuzz(n) {
  const result = [];

  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      result.push('FizzBuzz');
    } else if (i % 3 === 0) {
      result.push('Fizz');
    } else if (i % 5 === 0) {
      result.push('Buzz');
    } else {
      result.push(String(i));
    }
  }

  return result;
}

/**
 * Esercizio 5 â€” Parola piÃ¹ lunga
 *
 * Scrivi una funzione `longestWord(sentence)` che restituisce la parola
 * piÃ¹ lunga presente nella stringa `sentence`.
 * In caso di paritÃ , restituisci la prima in ordine di apparizione.
 * Se la stringa Ã¨ vuota, restituisci una stringa vuota `""`.
 *
 * Utile in contesti di analisi testuale e SEO.
 *
 * Esempi:
 *   longestWord("the quick brown fox")   â†’ "quick"
 *   longestWord("un due tre")             â†’ "due"    // prima tra pari
 *   longestWord("")                       â†’ ""
 */
export function longestWord(sentence) {
  if (sentence === '') return '';

  const words = sentence.split(' ');
  let longest = words[0];

  for (const word of words) {
    if (word.length > longest.length) {
      longest = word;
    }
  }

  return longest;
}

/**
 * Esercizio 6 â€” Controllo palindromo
 *
 * Scrivi una funzione `isPalindrome(str)` che restituisce `true` se la
 * stringa `str` Ã¨ un palindromo, `false` altrimenti.
 *
 * Ignora spazi e differenze maiuscolo/minuscolo.
 *
 * Una stringa Ã¨ palindroma se si legge allo stesso modo da sinistra a
 * destra e da destra a sinistra. Utile in algoritmi di validazione e
 * giochi con le parole.
 *
 * Esempi:
 *   isPalindrome("racecar")                          â†’ true
 *   isPalindrome("A man a plan a canal Panama")      â†’ true
 *   isPalindrome("hello")                            â†’ false
 *   isPalindrome("Era una vasca da bagno assai grande")  â†’ false
 */
export function isPalindrome(str) {
  const cleaned = str.toLowerCase().split(' ').join('');
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}

/**
 * Esercizio 7 â€” Calcola sconto
 *
 * Scrivi una funzione `applyDiscount(price, discountPercent)` che
 * restituisce il prezzo finale dopo aver applicato uno sconto percentuale.
 *
 * Valida gli input:
 * - `price` deve essere un numero positivo (> 0).
 * - `discountPercent` deve essere compreso tra 0 e 100 (inclusi).
 * - Se uno dei valori non Ã¨ valido, restituisci `null`.
 *
 * Arrotonda il risultato a due decimali.
 * Tipico in sistemi e-commerce e gestionali.
 *
 * Esempi:
 *   applyDiscount(100, 20)   â†’ 80
 *   applyDiscount(49.99, 10) â†’ 44.99
 *   applyDiscount(50, 0)     â†’ 50
 *   applyDiscount(-10, 20)   â†’ null
 *   applyDiscount(100, 110)  â†’ null
 */
export function applyDiscount(price, discountPercent) {
  if (price <= 0) return null;
  if (discountPercent < 0 || discountPercent > 100) return null;

  const finalPrice = price - (price * discountPercent / 100);
  return Math.round(finalPrice * 100) / 100;
}

/**
 * Esercizio 8 â€” Rimuovi duplicati
 *
 * Scrivi una funzione `removeDuplicates(arr)` che restituisce un nuovo array
 * contenente gli stessi elementi di `arr` ma senza ripetizioni.
 * L'ordine di apparizione originale deve essere preservato.
 *
 * Non modificare l'array originale.
 * Utile nella pulizia di dati provenienti da API o database.
 *
 * Suggerimento: puoi usare `filter` e `indexOf`, oppure `reduce`,
 * oppure `Set` â€” scegli l'approccio che preferisci.
 *
 * Esempi:
 *   removeDuplicates([1, 2, 2, 3, 1])       â†’ [1, 2, 3]
 *   removeDuplicates(["a", "b", "a", "c"])   â†’ ["a", "b", "c"]
 *   removeDuplicates([])                      â†’ []
 *   removeDuplicates([42])                    â†’ [42]
 */
export function removeDuplicates(arr) {
  return [...new Set(arr)];
}

/**
 * Esercizio 9 â€” Capitalizza ogni parola
 *
 * Scrivi una funzione `capitalizeWords(sentence)` che restituisce una nuova
 * stringa in cui ogni parola ha la prima lettera maiuscola e le restanti
 * lettere minuscole.
 *
 * Se la stringa Ã¨ vuota, restituisci una stringa vuota.
 * Utile per formattare nomi, titoli e intestazioni.
 *
 * Esempi:
 *   capitalizeWords("hello world")        â†’ "Hello World"
 *   capitalizeWords("JAVASCRIPT is FUN")  â†’ "Javascript Is Fun"
 *   capitalizeWords("ciao")               â†’ "Ciao"
 *   capitalizeWords("")                   â†’ ""
 */
export function capitalizeWords(sentence) {
  if (sentence === '') return '';

  return sentence
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Esercizio 10 â€” Valida una password
 *
 * Scrivi una funzione `validatePassword(password)` che verifica se una
 * password rispetta le seguenti regole:
 * 1. Almeno 8 caratteri
 * 2. Almeno una lettera maiuscola
 * 3. Almeno un numero
 * 4. Almeno un carattere speciale tra: ! @ # $ % ^ & *
 *
 * Restituisce un array di stringhe con i messaggi di errore in italiano
 * per ogni regola non rispettata.
 * Se la password Ã¨ valida, restituisce un array vuoto.
 *
 * Questo tipo di validazione Ã¨ fondamentale nei form di registrazione.
 *
 * Esempi:
 *   validatePassword("Abcdefg1!")  â†’ []
 *   validatePassword("abc")        â†’ [
 *     "Almeno 8 caratteri",
 *     "Almeno una lettera maiuscola",
 *     "Almeno un numero",
 *     "Almeno un carattere speciale (!@#$%^&*)"
 *   ]
 *   validatePassword("abcdefgh")   â†’ [
 *     "Almeno una lettera maiuscola",
 *     "Almeno un numero",
 *     "Almeno un carattere speciale (!@#$%^&*)"
 *   ]
 */
export function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push('Almeno 8 caratteri');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Almeno una lettera maiuscola');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Almeno un numero');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Almeno un carattere speciale (!@#$%^&*)');
  }

  return errors;
}