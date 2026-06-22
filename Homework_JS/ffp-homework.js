/**
 * Esercizio 1 â€” Normalizza prodotti
 *
 * Immagina di ricevere una lista di prodotti grezzi provenienti da un'API
 * con nomi di campo inconsistenti. Scrivi una funzione PURA
 * `normalizeProducts(rawProducts)` che restituisce un nuovo array
 * di prodotti normalizzati.
 *
 * Ogni prodotto grezzo ha la forma:
 *   { product_name, selling_price, in_stock, category_id }
 *
 * Ogni prodotto normalizzato deve avere la forma:
 *   { name, price, available, categoryId }
 * dove:
 *   - `name` Ã¨ `product_name` con spazi iniziali/finali rimossi
 *   - `price` Ã¨ `selling_price` come numero (arrotondato a 2 decimali)
 *   - `available` Ã¨ `in_stock` convertito in booleano
 *   - `categoryId` Ã¨ `category_id` come numero intero
 *
 * L'array originale NON deve essere modificato.
 * Usa `map` â€” nessun loop esplicito.
 *
 * Esempi:
 *   normalizeProducts([{ product_name: " Mela ", selling_price: 1.499,
 *     in_stock: 1, category_id: "3" }])
 *   â†’ [{ name: "Mela", price: 1.5, available: true, categoryId: 3 }]
 */
export function normalizeProducts(rawProducts) {
  return rawProducts.map((raw) => ({
    name: raw.product_name.trim(),
    price: Math.round(raw.selling_price * 100) / 100,
    available: Boolean(raw.in_stock),
    categoryId: parseInt(raw.category_id, 10),
  }));
}

/**
 * Esercizio 2 â€” Catalogo filtrato e classificato
 *
 * Scrivi una funzione PURA `filterAndRank(products, minPrice, maxPrice, topN)`
 * che, dato un array di prodotti normalizzati (vedi Esercizio 1):
 *
 * 1. Filtra i prodotti disponibili (`available === true`)
 * 2. Filtra i prodotti con prezzo compreso tra `minPrice` e `maxPrice` (inclusi)
 * 3. Ordina i risultati per prezzo crescente
 * 4. Restituisce solo i primi `topN` elementi
 *
 * Nessun array originale deve essere mutato.
 * Usa `filter`, `sort` (su copia), `slice` â€” nessun loop esplicito.
 *
 * Esempi:
 *   filterAndRank(products, 1, 5, 2)
 *   â†’ i 2 prodotti disponibili piÃ¹ economici tra 1â‚¬ e 5â‚¬
 */
export function filterAndRank(products, minPrice, maxPrice, topN) {
  return products
    .filter((p) => p.available && p.price >= minPrice && p.price <= maxPrice)
    .slice()
    .sort((a, b) => a.price - b.price)
    .slice(0, topN);
}

/**
 * Esercizio 3 â€” groupBy (higher-order function)
 *
 * Scrivi una funzione PURA `groupBy(arr, keyFn)` dove:
 * - `arr` Ã¨ un array di qualsiasi tipo
 * - `keyFn` Ã¨ una funzione che riceve un elemento e restituisce una stringa
 *   da usare come chiave di raggruppamento
 *
 * La funzione restituisce un oggetto dove:
 * - le chiavi sono i valori restituiti da `keyFn`
 * - i valori sono array di elementi che producono quella chiave
 *
 * Usa `reduce` â€” nessun loop esplicito.
 * L'array originale NON deve essere modificato.
 *
 * Esempi:
 *   groupBy([1, 2, 3, 4, 5], x => x % 2 === 0 ? 'pari' : 'dispari')
 *   â†’ { dispari: [1, 3, 5], pari: [2, 4] }
 *
 *   groupBy(products, p => p.categoryId)
 *   â†’ { 1: [...], 2: [...], ... }
 */
export function groupBy(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
    return groups;
  }, {});
}

/**
 * Esercizio 4 â€” Applicazione parziale
 *
 * Scrivi una funzione `partial(fn, ...fixedArgs)` che restituisce
 * una nuova funzione con i primi argomenti giÃ  "fissati".
 *
 * La funzione restituita, quando chiamata con ulteriori argomenti,
 * invoca `fn` con la concatenazione di `fixedArgs` e i nuovi argomenti.
 *
 * L'applicazione parziale Ã¨ fondamentale per creare funzioni specializzate
 * a partire da funzioni generiche, senza ripetere argomenti comuni.
 *
 * Esempi:
 *   const add = (a, b) => a + b;
 *   const add10 = partial(add, 10);
 *   add10(5)  â†’ 15
 *   add10(20) â†’ 30
 *
 *   const greet = (greeting, name) => `${greeting}, ${name}!`;
 *   const ciao  = partial(greet, 'Ciao');
 *   ciao('Alice') â†’ 'Ciao, Alice!'
 *   ciao('Bob')   â†’ 'Ciao, Bob!'
 */
export function partial(fn, ...fixedArgs) {
  return (...remainingArgs) => fn(...fixedArgs, ...remainingArgs);
}

/**
 * Esercizio 5 â€” once (closure)
 *
 * Scrivi una funzione `once(fn)` che restituisce una nuova funzione
 * che esegue `fn` solo alla prima chiamata e poi restituisce sempre
 * lo stesso risultato (quello della prima chiamata), ignorando gli
 * argomenti delle chiamate successive.
 *
 * Questo pattern Ã¨ usato per inizializzazioni costose che devono
 * avvenire una sola volta (lazy initialization, singleton, ecc.).
 *
 * Usa una closure per memorizzare lo stato interno.
 *
 * Esempi:
 *   let count = 0;
 *   const init = once(() => ++count);
 *   init()  â†’ 1
 *   init()  â†’ 1  (non incrementa di nuovo)
 *   init()  â†’ 1
 *   count   â†’ 1  (fn Ã¨ stata chiamata una sola volta)
 */
export function once(fn) {
  let called = false;
  let result;

  return (...args) => {
    if (!called) {
      result = fn(...args);
      called = true;
    }

    return result;
  };
}

/**
 * Esercizio 6 â€” memoize (closure + cache)
 *
 * Scrivi una funzione `memoize(fn)` che restituisce una versione
 * "memoizzata" di `fn`: se la funzione viene chiamata con lo stesso
 * argomento primitivo piÃ¹ volte, il calcolo viene effettuato solo
 * la prima volta e il risultato Ã¨ recuperato dalla cache.
 *
 * La cache deve essere accessibile solo tramite chiusura (non esposta).
 * Usa un oggetto come dizionario per la cache.
 * Per i test, la funzione memoizzata deve esporre un metodo `cacheSize()`
 * che restituisce il numero di risultati memorizzati.
 *
 * Esempi:
 *   let calls = 0;
 *   const expensive = memoize(n => { calls++; return n * n; });
 *   expensive(4)  â†’ 16  (calcola)
 *   expensive(4)  â†’ 16  (dalla cache)
 *   expensive(5)  â†’ 25  (calcola)
 *   calls         â†’ 2
 *   expensive.cacheSize() â†’ 2
 */
export function memoize(fn) {
  const cache = {};

  const memoized = (arg) => {
    if (arg in cache) {
      return cache[arg];
    }

    const result = fn(arg);
    cache[arg] = result;
    return result;
  };

  memoized.cacheSize = () => Object.keys(cache).length;

  return memoized;
}

/**
 * Esercizio 7 â€” Registro transazioni
 *
 * Scrivi una funzione PURA `computeBalance(transactions)` che,
 * dato un array di transazioni, calcola il saldo finale.
 *
 * Ogni transazione Ã¨ un oggetto `{ type, amount }` dove:
 * - `type` Ã¨ `'credit'` (aggiunge al saldo) o `'debit'` (sottrae)
 * - `amount` Ã¨ un numero positivo
 *
 * Usa `reduce` â€” nessun loop esplicito.
 * Arrotonda il risultato finale a due decimali.
 * Se l'array Ã¨ vuoto, restituisci 0.
 *
 * Scrivi anche `getCredits(transactions)` e `getDebits(transactions)`:
 * funzioni pure che restituiscono rispettivamente la somma totale
 * di crediti e debiti, usando `filter` + `reduce`.
 *
 * Esempi:
 *   computeBalance([
 *     { type: 'credit', amount: 100 },
 *     { type: 'debit',  amount: 30 },
 *     { type: 'credit', amount: 50 },
 *   ]) â†’ 120
 */
export function computeBalance(transactions) {
  const balance = transactions.reduce((total, tx) => {
    return tx.type === 'credit' ? total + tx.amount : total - tx.amount;
  }, 0);

  return Math.round(balance * 100) / 100;
}

export function getCredits(transactions) {
  return transactions
    .filter((tx) => tx.type === 'credit')
    .reduce((total, tx) => total + tx.amount, 0);
}

export function getDebits(transactions) {
  return transactions
    .filter((tx) => tx.type === 'debit')
    .reduce((total, tx) => total + tx.amount, 0);
}

/**
 * Esercizio 8 â€” Appiattisci righe d'ordine
 *
 * In un sistema e-commerce gli ordini hanno la forma:
 *   { id, customerId, items: [{ product, qty, price }] }
 *
 * Scrivi una funzione PURA `flattenLineItems(orders)` che restituisce
 * un array piatto di righe d'ordine, dove ogni elemento ha la forma:
 *   { orderId, customerId, product, qty, price, total }
 * dove `total = qty * price` (arrotondato a 2 decimali).
 *
 * Usa `flatMap` (o `reduce`) â€” nessun loop esplicito.
 * L'array originale NON deve essere modificato.
 *
 * Esempi:
 *   flattenLineItems([
 *     { id: 1, customerId: 'c1', items: [
 *       { product: 'Mela', qty: 3, price: 0.5 },
 *       { product: 'Kiwi', qty: 1, price: 2.0 },
 *     ]},
 *   ])
 *   â†’ [
 *     { orderId: 1, customerId: 'c1', product: 'Mela', qty: 3, price: 0.5, total: 1.5 },
 *     { orderId: 1, customerId: 'c1', product: 'Kiwi', qty: 1, price: 2.0, total: 2.0 },
 *   ]
 */
export function flattenLineItems(orders) {
  return orders.flatMap((order) =>
    order.items.map((item) => ({
      orderId: order.id,
      customerId: order.customerId,
      product: item.product,
      qty: item.qty,
      price: item.price,
      total: Math.round(item.qty * item.price * 100) / 100,
    })),
  );
}

/**
 * Esercizio 9 â€” Helper immutabili per array
 *
 * Scrivi tre funzioni PURE per modificare array senza mai mutarli:
 *
 * - `updateAt(arr, index, value)` â†’ restituisce un nuovo array dove
 *   l'elemento all'indice `index` Ã¨ sostituito con `value`.
 *
 * - `removeAt(arr, index)` â†’ restituisce un nuovo array senza l'elemento
 *   all'indice `index`.
 *
 * - `insertAt(arr, index, value)` â†’ restituisce un nuovo array con `value`
 *   inserito PRIMA dell'elemento all'indice `index`.
 *   Se `index >= arr.length`, aggiunge in coda.
 *
 * Tutte e tre NON devono modificare l'array originale.
 * Usa spread operator e/o `slice` â€” nessun loop esplicito.
 *
 * Esempi:
 *   updateAt([1, 2, 3], 1, 99)   â†’ [1, 99, 3]
 *   removeAt([1, 2, 3], 1)       â†’ [1, 3]
 *   insertAt([1, 2, 3], 1, 99)   â†’ [1, 99, 2, 3]
 *   insertAt([1, 2, 3], 10, 99)  â†’ [1, 2, 3, 99]
 */
export function updateAt(arr, index, value) {
  return arr.map((item, i) => (i === index ? value : item));
}

export function removeAt(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function insertAt(arr, index, value) {
  return [...arr.slice(0, index), value, ...arr.slice(index)];
}

/**
 * Esercizio 10 â€” Pipeline dati con pipe
 *
 * Implementa la funzione `pipe(...fns)` che compone funzioni
 * da sinistra a destra: `pipe(f, g, h)(x)` equivale a `h(g(f(x)))`.
 *
 * Poi usa `pipe` per costruire una funzione `processUserReport(users)`
 * che elabora una lista di utenti grezzi attraverso una pipeline di trasformazioni:
 *
 * 1. **normalize** â€” converte ogni utente in `{ name, email, age }` dove
 *    `name` Ã¨ `first_name + ' ' + last_name` (trimmed) e
 *    `age` Ã¨ un intero
 * 2. **filterAdults** â€” mantiene solo gli utenti con `age >= 18`
 * 3. **sortByName** â€” ordina alfabeticamente per `name` (su copia)
 * 4. **toReport** â€” map su ogni utente â†’ stringa `"<name> (<age>)"`
 *
 * Ogni fase deve essere una funzione pura separata (esportata).
 * L'array originale NON deve mai essere modificato.
 *
 * Esempi:
 *   processUserReport([
 *     { first_name: 'Alice ', last_name: 'Rossi', age: '30', email: 'a@x.com' },
 *     { first_name: 'Bob',   last_name: 'Verdi', age: '15', email: 'b@x.com' },
 *   ])
 *   â†’ ["Alice Rossi (30)"]
 */
export const pipe = (...fns) => (x) => fns.reduce((value, fn) => fn(value), x);

export const normalizeUsers = (users) =>
  users.map((u) => ({
    name: `${u.first_name.trim()} ${u.last_name.trim()}`,
    email: u.email,
    age: parseInt(u.age, 10),
  }));

export const filterAdults = (users) => users.filter((u) => u.age >= 18);

export const sortByName = (users) =>
  users.slice().sort((a, b) => a.name.localeCompare(b.name));

export const toReport = (users) => users.map((u) => `${u.name} (${u.age})`);

export const processUserReport = pipe(
  normalizeUsers,
  filterAdults,
  sortByName,
  toReport,
);