import { test, expect, describe } from 'vitest';
import {
  Rectangle,
  Queue,
  TemperatureLogger,
  ShoppingCart,
  Vehicle,
  ElectricVehicle,
  UserProfile,
  EventCalendar,
  Inventory,
  StringUtils,
  Scoreboard,
} from './objects-homework.js';

// ---------------------------------------------------------------------------
// Esercizio 1 â€” Rectangle
// ---------------------------------------------------------------------------
describe('Rectangle', () => {
  test('calcola l\'area', () => {
    expect(new Rectangle(4, 6).area()).toBe(24);
  });

  test('calcola il perimetro', () => {
    expect(new Rectangle(4, 6).perimeter()).toBe(20);
  });

  test('isSquare restituisce false per rettangolo non quadrato', () => {
    expect(new Rectangle(4, 6).isSquare()).toBe(false);
  });

  test('isSquare restituisce true per un quadrato', () => {
    expect(new Rectangle(5, 5).isSquare()).toBe(true);
  });

  test('scale restituisce un nuovo Rectangle con dimensioni scalate', () => {
    const r = new Rectangle(4, 6);
    const scaled = r.scale(2);
    expect(scaled.area()).toBe(96);
  });

  test('scale non modifica il Rectangle originale', () => {
    const r = new Rectangle(4, 6);
    r.scale(3);
    expect(r.area()).toBe(24);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 2 â€” Queue
// ---------------------------------------------------------------------------
describe('Queue', () => {
  test('Ã¨ vuota alla creazione', () => {
    expect(new Queue().isEmpty()).toBe(true);
  });

  test('enqueue aumenta la dimensione', () => {
    const q = new Queue();
    q.enqueue('a');
    q.enqueue('b');
    expect(q.size).toBe(2);
  });

  test('dequeue restituisce l\'elemento in testa (FIFO)', () => {
    const q = new Queue();
    q.enqueue('a');
    q.enqueue('b');
    expect(q.dequeue()).toBe('a');
    expect(q.size).toBe(1);
  });

  test('peek restituisce l\'elemento in testa senza rimuoverlo', () => {
    const q = new Queue();
    q.enqueue('x');
    expect(q.peek()).toBe('x');
    expect(q.size).toBe(1);
  });

  test('dequeue su coda vuota lancia errore', () => {
    expect(() => new Queue().dequeue()).toThrow('Coda vuota');
  });

  test('peek su coda vuota lancia errore', () => {
    expect(() => new Queue().peek()).toThrow('Coda vuota');
  });

});

// ---------------------------------------------------------------------------
// Esercizio 3 â€” TemperatureLogger
// ---------------------------------------------------------------------------
describe('TemperatureLogger', () => {
  test('min/max/average restituiscono null senza misurazioni', () => {
    const l = new TemperatureLogger();
    expect(l.min()).toBeNull();
    expect(l.max()).toBeNull();
    expect(l.average()).toBeNull();
  });

  test('calcola min correttamente', () => {
    const l = new TemperatureLogger();
    l.log(20); l.log(23); l.log(18);
    expect(l.min()).toBe(18);
  });

  test('calcola max correttamente', () => {
    const l = new TemperatureLogger();
    l.log(20); l.log(23); l.log(18);
    expect(l.max()).toBe(23);
  });

  test('calcola la media arrotondata a due decimali', () => {
    const l = new TemperatureLogger();
    l.log(20); l.log(23); l.log(18);
    expect(l.average()).toBe(20.33);
  });

  test('count restituisce il numero di misurazioni', () => {
    const l = new TemperatureLogger();
    l.log(10); l.log(20);
    expect(l.count).toBe(2);
  });

  test('clear azzera le misurazioni', () => {
    const l = new TemperatureLogger();
    l.log(10);
    l.clear();
    expect(l.count).toBe(0);
    expect(l.min()).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Esercizio 4 â€” ShoppingCart
// ---------------------------------------------------------------------------
describe('ShoppingCart', () => {
  test('carrello vuoto ha totale 0', () => {
    expect(new ShoppingCart().getTotal()).toBe(0);
  });

  test('addItem aggiunge un nuovo articolo', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: 'Mela', price: 0.5 });
    expect(cart.itemCount).toBe(1);
  });

  test('addItem con id esistente incrementa la quantitÃ ', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: 'Mela', price: 0.5 });
    cart.addItem({ id: 1, name: 'Mela', price: 0.5 });
    expect(cart.itemCount).toBe(2);
    expect(cart.getItems().length).toBe(1);
  });

  test('getTotal calcola correttamente', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: 'Mela', price: 1.5 });
    cart.addItem({ id: 1, name: 'Mela', price: 1.5 });
    cart.addItem({ id: 2, name: 'Kiwi', price: 2.0 });
    expect(cart.getTotal()).toBe(5);
  });

  test('removeItem rimuove l\'articolo', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: 'Mela', price: 1 });
    cart.removeItem(1);
    expect(cart.itemCount).toBe(0);
  });

  test('updateQuantity cambia la quantitÃ ', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: 'Mela', price: 1 });
    cart.updateQuantity(1, 5);
    expect(cart.itemCount).toBe(5);
  });

  test('updateQuantity con quantitÃ  < 1 lancia errore', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: 'Mela', price: 1 });
    expect(() => cart.updateQuantity(1, 0)).toThrow('QuantitÃ  non valida');
  });

  test('getItems restituisce una copia (non il riferimento interno)', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: 'Mela', price: 1 });
    const items = cart.getItems();
    items.push({ id: 99, name: 'Fake', price: 0, quantity: 1 });
    expect(cart.getItems().length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 5 â€” Vehicle + ElectricVehicle
// ---------------------------------------------------------------------------
describe('Vehicle', () => {
  test('describe restituisce la stringa corretta', () => {
    expect(new Vehicle('Toyota', 'Yaris', 2018).describe()).toBe('2018 Toyota Yaris');
  });

  test('age calcola gli anni trascorsi', () => {
    expect(new Vehicle('Toyota', 'Yaris', 2018).age()).toBe(8);
  });
});

describe('ElectricVehicle', () => {
  test('describe include la dicitura elettrico', () => {
    const ev = new ElectricVehicle('Tesla', 'Model 3', 2022, 75);
    expect(ev.describe()).toBe('2022 Tesla Model 3 (elettrico, 75 kWh)');
  });

  test('estimateRange calcola il range arrotondato', () => {
    expect(new ElectricVehicle('Tesla', 'Model 3', 2022, 75).estimateRange(0.15)).toBe(500);
  });

  test('Ã¨ instanceof Vehicle', () => {
    expect(new ElectricVehicle('X', 'Y', 2020, 50) instanceof Vehicle).toBe(true);
  });

  test('age Ã¨ ereditato da Vehicle', () => {
    expect(new ElectricVehicle('Tesla', 'Model 3', 2020, 75).age()).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// Esercizio 6 â€” UserProfile
// ---------------------------------------------------------------------------
describe('UserProfile', () => {
  test('crea un profilo valido', () => {
    const u = new UserProfile('alice', 'alice@example.com', 25);
    expect(u.username).toBe('alice');
    expect(u.email).toBe('alice@example.com');
    expect(u.age).toBe(25);
  });

  test('toJSON restituisce un oggetto semplice', () => {
    const u = new UserProfile('alice', 'alice@example.com', 25);
    expect(u.toJSON()).toEqual({ username: 'alice', email: 'alice@example.com', age: 25 });
  });

  test('username troppo corto lancia errore', () => {
    expect(() => new UserProfile('ab', 'ab@x.com', 20)).toThrow('Username non valido');
  });

  test('email senza @ lancia errore', () => {
    expect(() => new UserProfile('alice', 'invalidemail', 25)).toThrow('Email non valida');
  });

  test('etÃ  negativa lancia errore', () => {
    expect(() => new UserProfile('alice', 'alice@example.com', -1)).toThrow('EtÃ  non valida');
  });

  test('etÃ  > 120 lancia errore', () => {
    expect(() => new UserProfile('alice', 'alice@example.com', 200)).toThrow('EtÃ  non valida');
  });

  test('setter aggiorna il valore', () => {
    const u = new UserProfile('alice', 'alice@example.com', 25);
    u.age = 30;
    expect(u.age).toBe(30);
  });

  test('i campi privati non sono accessibili direttamente', () => {
    const u = new UserProfile('alice', 'alice@example.com', 25);
    expect(u['#username']).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Esercizio 7 â€” EventCalendar
// ---------------------------------------------------------------------------
describe('EventCalendar', () => {
  test('addEvent restituisce un id incrementale', () => {
    const cal = new EventCalendar();
    expect(cal.addEvent('A', '2026-03-01')).toBe(1);
    expect(cal.addEvent('B', '2026-03-02')).toBe(2);
  });

  test('count restituisce il numero totale di eventi', () => {
    const cal = new EventCalendar();
    cal.addEvent('A', '2026-03-01');
    cal.addEvent('B', '2026-03-01');
    expect(cal.count).toBe(2);
  });

  test('getByDate restituisce solo gli eventi di quella data', () => {
    const cal = new EventCalendar();
    cal.addEvent('A', '2026-03-01');
    cal.addEvent('B', '2026-03-01');
    cal.addEvent('C', '2026-04-10');
    expect(cal.getByDate('2026-03-01').length).toBe(2);
    expect(cal.getByDate('2026-04-10').length).toBe(1);
  });

  test('removeEvent rimuove l\'evento corretto', () => {
    const cal = new EventCalendar();
    const id = cal.addEvent('A', '2026-03-01');
    cal.addEvent('B', '2026-03-01');
    cal.removeEvent(id);
    expect(cal.getByDate('2026-03-01').length).toBe(1);
  });

  test('getUpcoming filtra e ordina correttamente', () => {
    const cal = new EventCalendar();
    cal.addEvent('Passato', '2026-01-01');
    cal.addEvent('Prossimo', '2026-06-01');
    cal.addEvent('Futuro', '2026-12-01');
    const upcoming = cal.getUpcoming('2026-03-15');
    expect(upcoming.length).toBe(2);
    expect(upcoming[0].title).toBe('Prossimo');
  });
});

// ---------------------------------------------------------------------------
// Esercizio 8 â€” Inventory
// ---------------------------------------------------------------------------
describe('Inventory', () => {
  
});

// ---------------------------------------------------------------------------
// Esercizio 9 â€” StringUtils
// ---------------------------------------------------------------------------
describe('StringUtils', () => {
  
});

// ---------------------------------------------------------------------------
// Esercizio 10 â€” Scoreboard
// ---------------------------------------------------------------------------
describe('Scoreboard', () => {
 
});