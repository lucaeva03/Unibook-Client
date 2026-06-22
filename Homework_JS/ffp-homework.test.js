import { test, expect, describe } from 'vitest';
import {
  normalizeProducts,
  filterAndRank,
  groupBy,
  partial,
  once,
  memoize,
  computeBalance,
  getCredits,
  getDebits,
  flattenLineItems,
  updateAt,
  removeAt,
  insertAt,
  pipe,
  normalizeUsers,
  filterAdults,
  sortByName,
  toReport,
  processUserReport,
} from './ffp-homework.js';

// ---------------------------------------------------------------------------
// Esercizio 1 â€” normalizeProducts
// ---------------------------------------------------------------------------
describe('normalizeProducts', () => {
  const raw = [
    { product_name: ' Mela ', selling_price: 1.499, in_stock: 1, category_id: '3' },
    { product_name: 'Kiwi',   selling_price: 2.0,   in_stock: 0, category_id: '2' },
  ];

  test('converte product_name â†’ name (trimmed)', () => {
    expect(normalizeProducts(raw)[0].name).toBe('Mela');
  });

  test('arrotonda selling_price â†’ price a 2 decimali', () => {
    expect(normalizeProducts(raw)[0].price).toBe(1.5);
  });

  test('converte in_stock â†’ available come booleano', () => {
    expect(normalizeProducts(raw)[0].available).toBe(true);
    expect(normalizeProducts(raw)[1].available).toBe(false);
  });

  test('converte category_id â†’ categoryId come intero', () => {
    expect(normalizeProducts(raw)[0].categoryId).toBe(3);
  });

  test('restituisce un nuovo array (non muta l\'originale)', () => {
    const copy = [...raw];
    normalizeProducts(raw);
    expect(raw).toEqual(copy);
  });

  test('trasforma tutti gli elementi', () => {
    expect(normalizeProducts(raw).length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 2 â€” filterAndRank
// ---------------------------------------------------------------------------
describe('filterAndRank', () => {
  const products = [
    { name: 'A', price: 1.0, available: true  },
    { name: 'B', price: 5.0, available: true  },
    { name: 'C', price: 3.0, available: false },
    { name: 'D', price: 2.0, available: true  },
    { name: 'E', price: 8.0, available: true  },
  ];

  test('filtra i prodotti non disponibili', () => {
    const result = filterAndRank(products, 0, 10, 10);
    expect(result.find(p => p.name === 'C')).toBeUndefined();
  });

  test('filtra per prezzo minimo e massimo', () => {
    const result = filterAndRank(products, 2, 5, 10);
    expect(result.some(p => p.name === 'A')).toBe(false); // 1.0 < min
    expect(result.some(p => p.name === 'E')).toBe(false); // 8.0 > max
  });

  test('ordina per prezzo crescente', () => {
    const result = filterAndRank(products, 0, 10, 10);
    expect(result[0].price).toBeLessThanOrEqual(result[1].price);
  });

  test('restituisce al massimo topN elementi', () => {
    expect(filterAndRank(products, 0, 10, 2).length).toBe(2);
  });

  test('non muta l\'array originale', () => {
    const copy = products.map(p => ({ ...p }));
    filterAndRank(products, 0, 10, 3);
    expect(products).toEqual(copy);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 3 â€” groupBy
// ---------------------------------------------------------------------------
describe('groupBy', () => {
  test('raggruppa numeri per paritÃ ', () => {
    const result = groupBy([1, 2, 3, 4, 5], x => x % 2 === 0 ? 'pari' : 'dispari');
    expect(result.pari).toEqual([2, 4]);
    expect(result.dispari).toEqual([1, 3, 5]);
  });

  test('raggruppa oggetti per campo', () => {
    const items = [
      { cat: 'frutta', name: 'Mela' },
      { cat: 'verdura', name: 'Carota' },
      { cat: 'frutta', name: 'Pera' },
    ];
    const result = groupBy(items, i => i.cat);
    expect(result.frutta.length).toBe(2);
    expect(result.verdura.length).toBe(1);
  });

  test('restituisce oggetto vuoto per array vuoto', () => {
    expect(groupBy([], x => x)).toEqual({});
  });

  test('non muta l\'array originale', () => {
    const arr = [1, 2, 3];
    groupBy(arr, x => x);
    expect(arr).toEqual([1, 2, 3]);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 4 â€” partial
// ---------------------------------------------------------------------------
describe('partial', () => {
  test('applica parzialmente una funzione a un argomento', () => {
    const add = (a, b) => a + b;
    const add10 = partial(add, 10);
    expect(add10(5)).toBe(15);
    expect(add10(20)).toBe(30);
  });

  test('pre-fissa piÃ¹ argomenti', () => {
    const greet = (greeting, punctuation, name) => `${greeting}, ${name}${punctuation}`;
    const ciao = partial(greet, 'Ciao', '!');
    expect(ciao('Alice')).toBe('Ciao, Alice!');
  });

  test('la funzione originale non viene chiamata al momento della creazione', () => {
    let called = false;
    const fn = () => { called = true; };
    partial(fn, 1);
    expect(called).toBe(false);
  });

  test('funziona con funzioni a un solo argomento', () => {
    const double = x => x * 2;
    const doubleFive = partial(double, 5);
    expect(doubleFive()).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 5 â€” once
// ---------------------------------------------------------------------------
describe('once', () => {
  test('la funzione viene chiamata solo la prima volta', () => {
    let count = 0;
    const init = once(() => ++count);
    init();
    init();
    init();
    expect(count).toBe(1);
  });

  test('restituisce sempre il risultato della prima chiamata', () => {
    const init = once(x => x * 2);
    expect(init(5)).toBe(10);
    expect(init(99)).toBe(10); // argomento ignorato
  });

  test('funziona con funzioni senza argomenti', () => {
    const init = once(() => 42);
    expect(init()).toBe(42);
    expect(init()).toBe(42);
  });

  test('due istanze indipendenti non si influenzano', () => {
    let n = 0;
    const a = once(() => ++n);
    const b = once(() => ++n);
    a(); b();
    expect(n).toBe(2);
    a(); b();
    expect(n).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 6 â€” memoize
// ---------------------------------------------------------------------------
describe('memoize', () => {
  test('restituisce il risultato corretto', () => {
    const square = memoize(n => n * n);
    expect(square(4)).toBe(16);
    expect(square(5)).toBe(25);
  });

  test('chiama la funzione originale solo una volta per argomento', () => {
    let calls = 0;
    const fn = memoize(n => { calls++; return n * n; });
    fn(4); fn(4); fn(4);
    expect(calls).toBe(1);
  });

  test('chiama la funzione per ogni argomento distinto', () => {
    let calls = 0;
    const fn = memoize(n => { calls++; return n; });
    fn(1); fn(2); fn(3);
    expect(calls).toBe(3);
  });

  test('cacheSize restituisce il numero di risultati memorizzati', () => {
    const fn = memoize(n => n);
    fn(1); fn(2); fn(1);
    expect(fn.cacheSize()).toBe(2);
  });

  test('la cache non Ã¨ accessibile direttamente sull\'oggetto', () => {
    const fn = memoize(n => n);
    expect(fn.cache).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Esercizio 7 â€” computeBalance / getCredits / getDebits
// ---------------------------------------------------------------------------
describe('computeBalance', () => {
  const txs = [
    { type: 'credit', amount: 100 },
    { type: 'debit',  amount: 30  },
    { type: 'credit', amount: 50  },
    { type: 'debit',  amount: 0.1 },
  ];

  test('calcola il saldo corretto', () => {
    expect(computeBalance(txs)).toBe(119.9);
  });

  test('restituisce 0 per array vuoto', () => {
    expect(computeBalance([])).toBe(0);
  });

  test('gestisce solo crediti', () => {
    expect(computeBalance([{ type: 'credit', amount: 50 }])).toBe(50);
  });

  test('gestisce solo debiti', () => {
    expect(computeBalance([{ type: 'debit', amount: 20 }])).toBe(-20);
  });
});

describe('getCredits e getDebits', () => {
  const txs = [
    { type: 'credit', amount: 100 },
    { type: 'debit',  amount: 30  },
    { type: 'credit', amount: 50  },
  ];

  test('getCredits somma solo i crediti', () => {
    expect(getCredits(txs)).toBe(150);
  });

  test('getDebits somma solo i debiti', () => {
    expect(getDebits(txs)).toBe(30);
  });

  test('credits - debits == balance', () => {
    expect(getCredits(txs) - getDebits(txs)).toBe(computeBalance(txs));
  });
});

// ---------------------------------------------------------------------------
// Esercizio 8 â€” flattenLineItems
// ---------------------------------------------------------------------------
describe('flattenLineItems', () => {
  const orders = [
    {
      id: 1, customerId: 'c1',
      items: [
        { product: 'Mela', qty: 3, price: 0.5 },
        { product: 'Kiwi', qty: 1, price: 2.0 },
      ],
    },
    {
      id: 2, customerId: 'c2',
      items: [
        { product: 'Pera', qty: 2, price: 1.5 },
      ],
    },
  ];

  test('produce il numero corretto di righe', () => {
    expect(flattenLineItems(orders).length).toBe(3);
  });

  test('ogni riga contiene orderId e customerId dell\'ordine padre', () => {
    const lines = flattenLineItems(orders);
    expect(lines[0].orderId).toBe(1);
    expect(lines[0].customerId).toBe('c1');
    expect(lines[2].orderId).toBe(2);
  });

  test('calcola total = qty * price arrotondato a 2 decimali', () => {
    const lines = flattenLineItems(orders);
    expect(lines[0].total).toBe(1.5);
    expect(lines[1].total).toBe(2.0);
  });

  test('non muta gli ordini originali', () => {
    const copy = JSON.stringify(orders);
    flattenLineItems(orders);
    expect(JSON.stringify(orders)).toBe(copy);
  });

  test('restituisce array vuoto per input vuoto', () => {
    expect(flattenLineItems([])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 9 â€” updateAt / removeAt / insertAt
// ---------------------------------------------------------------------------
describe('updateAt', () => {
  test('sostituisce l\'elemento all\'indice dato', () => {
    expect(updateAt([1, 2, 3], 1, 99)).toEqual([1, 99, 3]);
  });

  test('funziona sul primo elemento', () => {
    expect(updateAt([1, 2, 3], 0, 0)).toEqual([0, 2, 3]);
  });

  test('non muta l\'array originale', () => {
    const arr = [1, 2, 3];
    updateAt(arr, 0, 99);
    expect(arr).toEqual([1, 2, 3]);
  });
});

describe('removeAt', () => {
  test('rimuove l\'elemento all\'indice dato', () => {
    expect(removeAt([1, 2, 3], 1)).toEqual([1, 3]);
  });

  test('rimuove il primo elemento', () => {
    expect(removeAt([1, 2, 3], 0)).toEqual([2, 3]);
  });

  test('rimuove l\'ultimo elemento', () => {
    expect(removeAt([1, 2, 3], 2)).toEqual([1, 2]);
  });

  test('non muta l\'array originale', () => {
    const arr = [1, 2, 3];
    removeAt(arr, 0);
    expect(arr).toEqual([1, 2, 3]);
  });
});

describe('insertAt', () => {
  test('inserisce prima dell\'elemento all\'indice dato', () => {
    expect(insertAt([1, 2, 3], 1, 99)).toEqual([1, 99, 2, 3]);
  });

  test('inserisce in testa con indice 0', () => {
    expect(insertAt([1, 2, 3], 0, 0)).toEqual([0, 1, 2, 3]);
  });

  test('aggiunge in coda se index >= length', () => {
    expect(insertAt([1, 2, 3], 10, 99)).toEqual([1, 2, 3, 99]);
  });

  test('non muta l\'array originale', () => {
    const arr = [1, 2, 3];
    insertAt(arr, 1, 99);
    expect(arr).toEqual([1, 2, 3]);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 10 â€” pipe + processUserReport
// ---------------------------------------------------------------------------
describe('pipe', () => {
  test('compone due funzioni da sinistra a destra', () => {
    const add1  = x => x + 1;
    const times2 = x => x * 2;
    expect(pipe(add1, times2)(3)).toBe(8);  // (3+1)*2
    expect(pipe(times2, add1)(3)).toBe(7);  // 3*2+1
  });

  test('compone tre funzioni', () => {
    const trim     = s => s.trim();
    const lower    = s => s.toLowerCase();
    const exclaim  = s => s + '!';
    expect(pipe(trim, lower, exclaim)('  HELLO  ')).toBe('hello!');
  });

  test('con una sola funzione si comporta come identitÃ  composta', () => {
    expect(pipe(x => x * 3)(4)).toBe(12);
  });
});

describe('normalizeUsers', () => {
  test('combina first_name e last_name in name (trimmed)', () => {
    const result = normalizeUsers([{ first_name: ' Alice ', last_name: 'Rossi', age: '30', email: 'a@x.com' }]);
    expect(result[0].name).toBe('Alice Rossi');
  });

  test('converte age in intero', () => {
    const result = normalizeUsers([{ first_name: 'Bob', last_name: 'X', age: '25', email: '' }]);
    expect(result[0].age).toBe(25);
  });
});

describe('filterAdults', () => {
  test('mantiene solo gli utenti con etÃ  >= 18', () => {
    const users = [{ name: 'A', age: 17 }, { name: 'B', age: 18 }, { name: 'C', age: 30 }];
    expect(filterAdults(users).length).toBe(2);
  });
});

describe('sortByName', () => {
  test('ordina alfabeticamente per name', () => {
    const users = [{ name: 'Zara', age: 20 }, { name: 'Alice', age: 25 }];
    expect(sortByName(users)[0].name).toBe('Alice');
  });

  test('non muta l\'array originale', () => {
    const users = [{ name: 'Z', age: 20 }, { name: 'A', age: 20 }];
    sortByName(users);
    expect(users[0].name).toBe('Z');
  });
});

describe('toReport', () => {
  test('formatta ogni utente come stringa "<name> (<age>)"', () => {
    const users = [{ name: 'Alice Rossi', age: 30 }];
    expect(toReport(users)).toEqual(['Alice Rossi (30)']);
  });
});

describe('processUserReport (pipeline completa)', () => {
  const rawUsers = [
    { first_name: 'Alice ', last_name: 'Rossi', age: '30', email: 'a@x.com' },
    { first_name: 'Bob',   last_name: 'Verdi', age: '15', email: 'b@x.com' },
    { first_name: 'Carlo', last_name: 'Bianchi', age: '22', email: 'c@x.com' },
  ];

  test('esclude i minorenni', () => {
    const result = processUserReport(rawUsers);
    expect(result.some(r => r.includes('Bob'))).toBe(false);
  });

  test('ordina per nome', () => {
    const result = processUserReport(rawUsers);
    expect(result[0]).toMatch(/^Alice/);
    expect(result[1]).toMatch(/^Carlo/);
  });

  test('formatta correttamente ogni riga', () => {
    const result = processUserReport(rawUsers);
    expect(result[0]).toBe('Alice Rossi (30)');
  });

  test('non muta l\'array originale', () => {
    const copy = JSON.stringify(rawUsers);
    processUserReport(rawUsers);
    expect(JSON.stringify(rawUsers)).toBe(copy);
  });
});