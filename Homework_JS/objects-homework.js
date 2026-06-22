/**
 * Esercizio 1 â€” Rettangolo
 *
 * Scrivi una classe `Rectangle` che rappresenta un rettangolo.
 *
 * Il costruttore riceve `width` e `height` (numeri positivi).
 * La classe deve esporre i metodi:
 * - `area()` â†’ area del rettangolo (width * height)
 * - `perimeter()` â†’ perimetro (2 * (width + height))
 * - `isSquare()` â†’ true se width === height
 * - `scale(factor)` â†’ restituisce un NUOVO Rectangle con dimensioni moltiplicate
 *   per `factor` (non modifica il corrente)
 *
 * Esempi:
 *   const r = new Rectangle(4, 6);
 *   r.area()       â†’ 24
 *   r.perimeter()  â†’ 20
 *   r.isSquare()   â†’ false
 *   r.scale(2).area() â†’ 96
 *   r.area()          â†’ 24  (invariato)
 */
export class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }

  perimeter() {
    return 2 * (this.width + this.height);
  }

  isSquare() {
    return this.width === this.height;
  }

  scale(factor) {
    return new Rectangle(this.width * factor, this.height * factor);
  }
}

/**
 * Esercizio 2 â€” Coda (Queue)
 *
 * Scrivi una classe `Queue` che implementa una coda FIFO (First In, First Out).
 *
 * La classe deve esporre:
 * - `enqueue(item)` â†’ aggiunge un elemento in fondo alla coda
 * - `dequeue()` â†’ rimuove e restituisce l'elemento in testa;
 *   se la coda Ã¨ vuota, lancia un `Error` con messaggio "Coda vuota"
 * - `peek()` â†’ restituisce l'elemento in testa senza rimuoverlo;
 *   se vuota, lancia un `Error` con messaggio "Coda vuota"
 * - `isEmpty()` â†’ true se la coda non ha elementi
 * - `size` â†’ proprietÃ  (getter) che restituisce il numero di elementi
 *
 * La struttura interna deve essere nascosta (campo privato).
 *
 * Esempi:
 *   const q = new Queue();
 *   q.enqueue("a"); q.enqueue("b");
 *   q.peek()     â†’ "a"
 *   q.dequeue()  â†’ "a"
 *   q.size       â†’ 1
 */
export class Queue {
  #items = [];

  enqueue(item) {
    this.#items.push(item);
  }

  dequeue() {
    if (this.#items.length === 0) {
      throw new Error('Coda vuota');
    }

    return this.#items.shift();
  }

  peek() {
    if (this.#items.length === 0) {
      throw new Error('Coda vuota');
    }

    return this.#items[0];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  get size() {
    return this.#items.length;
  }
}

/**
 * Esercizio 3 â€” Registro temperature
 *
 * Scrivi una classe `TemperatureLogger` che registra le misurazioni di
 * una sonda di temperatura nel tempo.
 *
 * La classe deve esporre:
 * - `log(value)` â†’ aggiunge una misurazione (numero)
 * - `min()` â†’ valore minimo registrato; null se non ci sono misurazioni
 * - `max()` â†’ valore massimo registrato; null se non ci sono misurazioni
 * - `average()` â†’ media aritmetica arrotondata a due decimali;
 *   null se non ci sono misurazioni
 * - `count` â†’ getter che restituisce il numero di misurazioni
 * - `clear()` â†’ azzera tutte le misurazioni
 *
 * Esempi:
 *   const logger = new TemperatureLogger();
 *   logger.log(20); logger.log(23); logger.log(18);
 *   logger.min()     â†’ 18
 *   logger.max()     â†’ 23
 *   logger.average() â†’ 20.33
 *   logger.count     â†’ 3
 */
export class TemperatureLogger {
  #measurements = [];

  log(value) {
    this.#measurements.push(value);
  }

  min() {
    if (this.#measurements.length === 0) return null;
    return Math.min(...this.#measurements);
  }

  max() {
    if (this.#measurements.length === 0) return null;
    return Math.max(...this.#measurements);
  }

  average() {
    if (this.#measurements.length === 0) return null;
    const sum = this.#measurements.reduce((total, v) => total + v, 0);
    return Math.round((sum / this.#measurements.length) * 100) / 100;
  }

  get count() {
    return this.#measurements.length;
  }

  clear() {
    this.#measurements = [];
  }
}

/**
 * Esercizio 4 â€” Carrello della spesa
 *
 * Scrivi una classe `ShoppingCart` per gestire un carrello e-commerce.
 *
 * Un articolo Ã¨ un oggetto `{ id, name, price, quantity }`.
 * La classe deve esporre:
 * - `addItem({ id, name, price })` â†’ aggiunge 1 unitÃ . Se l'id esiste giÃ ,
 *   incrementa la quantitÃ  di 1.
 * - `removeItem(id)` â†’ rimuove completamente l'articolo dal carrello.
 *   Se non esiste, non fa nulla.
 * - `updateQuantity(id, quantity)` â†’ imposta la quantitÃ  (deve essere >= 1).
 *   Se quantity < 1, lancia un `Error` con messaggio "QuantitÃ  non valida".
 *   Se l'id non esiste, non fa nulla.
 * - `getTotal()` â†’ somma di (price * quantity) per tutti gli articoli,
 *   arrotondata a due decimali.
 * - `getItems()` â†’ restituisce una copia dell'array degli articoli (non il riferimento interno)
 * - `itemCount` â†’ getter che restituisce il numero totale di unitÃ  nel carrello
 *
 * Esempi:
 *   const cart = new ShoppingCart();
 *   cart.addItem({ id: 1, name: "Mela", price: 0.5 });
 *   cart.addItem({ id: 1, name: "Mela", price: 0.5 }); // quantitÃ  â†’ 2
 *   cart.getTotal() â†’ 1
 *   cart.itemCount  â†’ 2
 */
export class ShoppingCart {
  #items = [];

  addItem({ id, name, price }) {
    const existing = this.#items.find((item) => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.#items.push({ id, name, price, quantity: 1 });
    }
  }

  removeItem(id) {
    this.#items = this.#items.filter((item) => item.id !== id);
  }

  updateQuantity(id, quantity) {
    if (quantity < 1) {
      throw new Error('QuantitÃ  non valida');
    }

    const item = this.#items.find((item) => item.id === id);

    if (item) {
      item.quantity = quantity;
    }
  }

  getTotal() {
    const total = this.#items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return Math.round(total * 100) / 100;
  }

  getItems() {
    return this.#items.map((item) => ({ ...item }));
  }

  get itemCount() {
    return this.#items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

/**
 * Esercizio 5 â€” Veicolo ed Elettrico
 *
 * Scrivi due classi: `Vehicle` e `ElectricVehicle`.
 *
 * `Vehicle`:
 * - costruttore: `(make, model, year)`
 * - `describe()` â†’ stringa `"<year> <make> <model>"`
 * - `age()` â†’ anni trascorsi dall'anno del veicolo (usa 2026 come anno corrente)
 *
 * `ElectricVehicle` estende `Vehicle`:
 * - costruttore aggiuntivo: `batteryCapacity` (kWh)
 * - sovrascrive `describe()` â†’ `"<year> <make> <model> (elettrico, <batteryCapacity> kWh)"`
 * - `estimateRange(consumption)` â†’ range stimato in km dato il consumo
 *   in kWh per km (batteryCapacity / consumption), arrotondato all'intero
 *
 * Esempi:
 *   const v = new Vehicle("Toyota", "Yaris", 2018);
 *   v.describe() â†’ "2018 Toyota Yaris"
 *   v.age()      â†’ 8
 *
 *   const e = new ElectricVehicle("Tesla", "Model 3", 2022, 75);
 *   e.describe()              â†’ "2022 Tesla Model 3 (elettrico, 75 kWh)"
 *   e.estimateRange(0.15)     â†’ 500
 *   e instanceof Vehicle      â†’ true
 */
export class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }

  describe() {
    return `${this.year} ${this.make} ${this.model}`;
  }

  age() {
    return 2026 - this.year;
  }
}

export class ElectricVehicle extends Vehicle {
  constructor(make, model, year, batteryCapacity) {
    super(make, model, year);
    this.batteryCapacity = batteryCapacity;
  }

  describe() {
    return `${super.describe()} (elettrico, ${this.batteryCapacity} kWh)`;
  }

  estimateRange(consumption) {
    return Math.round(this.batteryCapacity / consumption);
  }
}

/**
 * Esercizio 6 â€” Profilo utente con validazione
 *
 * Scrivi una classe `UserProfile` che gestisce i dati di un utente
 * con campi privati e validazione tramite getter e setter.
 *
 * Campi privati: `#username`, `#email`, `#age`
 *
 * Costruttore: `(username, email, age)` â€” chiama i setter per validare.
 *
 * Getter e setter per:
 * - `username`: deve essere una stringa non vuota (almeno 3 caratteri);
 *   altrimenti lancia `Error("Username non valido")`
 * - `email`: deve contenere `@` e almeno un `.` dopo la `@`;
 *   altrimenti lancia `Error("Email non valida")`
 * - `age`: deve essere un numero tra 0 e 120 (inclusi);
 *   altrimenti lancia `Error("EtÃ  non valida")`
 *
 * Metodo:
 * - `toJSON()` â†’ restituisce un oggetto semplice `{ username, email, age }`
 *
 * Esempi:
 *   const u = new UserProfile("alice", "alice@example.com", 25);
 *   u.username        â†’ "alice"
 *   u.age = 200       â†’ Error("EtÃ  non valida")
 *   u.toJSON()        â†’ { username: "alice", email: "alice@example.com", age: 25 }
 */
export class UserProfile {
  #username;
  #email;
  #age;

  constructor(username, email, age) {
    this.username = username;
    this.email = email;
    this.age = age;
  }

  get username() {
    return this.#username;
  }

  set username(value) {
    if (typeof value !== 'string' || value.length < 3) {
      throw new Error('Username non valido');
    }

    this.#username = value;
  }

  get email() {
    return this.#email;
  }

  set email(value) {
    const atIndex = value.indexOf('@');

    if (atIndex === -1 || !value.slice(atIndex).includes('.')) {
      throw new Error('Email non valida');
    }

    this.#email = value;
  }

  get age() {
    return this.#age;
  }

  set age(value) {
    if (typeof value !== 'number' || value < 0 || value > 120) {
      throw new Error('EtÃ  non valida');
    }

    this.#age = value;
  }

  toJSON() {
    return {
      username: this.#username,
      email: this.#email,
      age: this.#age,
    };
  }
}

/**
 * Esercizio 7 â€” Agenda eventi
 *
 * Scrivi una classe `EventCalendar` per gestire un calendario di eventi.
 *
 * Ogni evento Ã¨ un oggetto interno `{ id, title, date }` dove `date` Ã¨
 * una stringa nel formato `"YYYY-MM-DD"`.
 *
 * La classe deve esporre:
 * - `addEvent(title, date)` â†’ aggiunge un evento e restituisce l'id assegnato
 *   (interi incrementali partendo da 1)
 * - `removeEvent(id)` â†’ rimuove l'evento con quell'id; non fa nulla se assente
 * - `getByDate(date)` â†’ restituisce un array di eventi per quella data
 * - `getUpcoming(fromDate)` â†’ restituisce eventi con data >= fromDate,
 *   ordinati dalla piÃ¹ vicina alla piÃ¹ lontana
 * - `count` â†’ getter con il numero totale di eventi
 *
 * Esempi:
 *   const cal = new EventCalendar();
 *   cal.addEvent("Riunione", "2026-03-01");  // â†’ 1
 *   cal.addEvent("Workshop", "2026-03-01");  // â†’ 2
 *   cal.addEvent("Conferenza", "2026-04-10"); // â†’ 3
 *   cal.getByDate("2026-03-01").length  â†’ 2
 *   cal.getUpcoming("2026-03-15").length â†’ 1
 */
export class EventCalendar {
  #events = [];
  #nextId = 1;

  addEvent(title, date) {
    const id = this.#nextId;
    this.#events.push({ id, title, date });
    this.#nextId += 1;
    return id;
  }

  removeEvent(id) {
    this.#events = this.#events.filter((event) => event.id !== id);
  }

  getByDate(date) {
    return this.#events.filter((event) => event.date === date);
  }

  getUpcoming(fromDate) {
    return this.#events
      .filter((event) => event.date >= fromDate)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  get count() {
    return this.#events.length;
  }
}

/**
 * Esercizio 8 â€” Inventario magazzino
 *
 * Scrivi una classe `Inventory` per gestire le scorte di un magazzino.
 *
 * Internamente usa un oggetto (dizionario) dove le chiavi sono i nomi
 * dei prodotti e i valori sono le quantitÃ  disponibili.
 *
 * La classe deve esporre:
 * - `addStock(product, quantity)` â†’ aggiunge `quantity` unitÃ  al prodotto;
 *   se il prodotto non esiste, lo crea. `quantity` deve essere > 0.
 * - `removeStock(product, quantity)` â†’ sottrae `quantity` unitÃ ;
 *   lancia `Error("Scorte insufficienti")` se la quantitÃ  disponibile Ã¨ minore.
 *   Lancia `Error("Prodotto non trovato")` se il prodotto non esiste.
 * - `getStock(product)` â†’ quantitÃ  disponibile; 0 se il prodotto non esiste.
 * - `getLowStock(threshold)` â†’ restituisce un array di nomi di prodotti
 *   con quantitÃ  <= threshold, ordinati alfabeticamente.
 * - `getReport()` â†’ usa `Object.entries` per restituire un array di stringhe
 *   nel formato `"<product>: <quantity> unitÃ "`, ordinate alfabeticamente.
 *
 * Esempi:
 *   const inv = new Inventory();
 *   inv.addStock("Mela", 100);
 *   inv.addStock("Kiwi", 5);
 *   inv.getLowStock(10)  â†’ ["Kiwi"]
 *   inv.getReport()      â†’ ["Kiwi: 5 unitÃ ", "Mela: 100 unitÃ "]
 */
export class Inventory {
  #stock = {};

  addStock(product, quantity) {
    if (quantity <= 0) return;

    if (!this.#stock[product]) {
      this.#stock[product] = 0;
    }

    this.#stock[product] += quantity;
  }

  removeStock(product, quantity) {
    if (!(product in this.#stock)) {
      throw new Error('Prodotto non trovato');
    }

    if (this.#stock[product] < quantity) {
      throw new Error('Scorte insufficienti');
    }

    this.#stock[product] -= quantity;
  }

  getStock(product) {
    return this.#stock[product] ?? 0;
  }

  getLowStock(threshold) {
    return Object.entries(this.#stock)
      .filter(([, quantity]) => quantity <= threshold)
      .map(([product]) => product)
      .sort();
  }

  getReport() {
    return Object.entries(this.#stock)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([product, quantity]) => `${product}: ${quantity} unità`);
  }
}


/**
 * Esercizio 9 â€” UtilitÃ  per stringhe (metodi statici)
 *
 * Scrivi una classe `StringUtils` con soli metodi statici,
 * senza costruttore (non si istanzia).
 *
 * Metodi statici:
 * - `truncate(str, maxLength, suffix = '...')` â†’ tronca la stringa a `maxLength`
 *   caratteri aggiungendo `suffix` solo se Ã¨ stata troncata.
 *   Se str.length <= maxLength, restituisce str invariata.
 * - `slugify(str)` â†’ converte la stringa in slug URL-friendly:
 *   tutto minuscolo, spazi (e sequenze di spazi) sostituiti con `-`,
 *   caratteri non alfanumerici e non trattini rimossi.
 *   Es: `"Hello World!"` â†’ `"hello-world"`
 * - `repeat(str, n, separator = '')` â†’ ripete la stringa `n` volte
 *   separata da `separator`. Se n <= 0 restituisce `""`.
 * - `countWords(str)` â†’ conta le parole (sequenze di caratteri non-spazio).
 *   Stringa vuota o solo spazi â†’ 0.
 *
 * Esempi:
 *   StringUtils.truncate("Hello World", 7)          â†’ "Hell..."
 *   StringUtils.truncate("Hello World", 7, 'â€¦')     â†’ "Hello â€¦"
 *   StringUtils.truncate("Hi", 10)                  â†’ "Hi"
 *   StringUtils.slugify("Ciao Mondo!")               â†’ "ciao-mondo"
 *   StringUtils.repeat("ha", 3, "-")                â†’ "ha-ha-ha"
 *   StringUtils.countWords("  tre  parole qui  ")   â†’ 3
 */
export class StringUtils {
  static truncate(str, maxLength, suffix = '...') {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - suffix.length) + suffix;
  }

  static slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  static repeat(str, n, separator = '') {
    if (n <= 0) return '';
    return Array(n).fill(str).join(separator);
  }

  static countWords(str) {
    const trimmed = str.trim();
    if (trimmed === '') return 0;
    return trimmed.split(/\s+/).length;
  }
}

/**
 * Esercizio 10 â€” Classifica punteggi
 *
 * Scrivi una classe `Scoreboard` per gestire i punteggi di un gioco.
 *
 * La classe deve esporre:
 * - `addScore(player, score)` â†’ registra un punteggio per un giocatore.
 *   Un giocatore puÃ² avere piÃ¹ punteggi (vengono tutti conservati).
 * - `getBest(player)` â†’ restituisce il punteggio migliore (massimo) del giocatore;
 *   `null` se il giocatore non esiste.
 * - `getAverage(player)` â†’ media dei punteggi del giocatore, arrotondata a due
 *   decimali; `null` se il giocatore non esiste.
 * - `getTopN(n)` â†’ restituisce un array dei primi `n` giocatori ordinati per
 *   punteggio migliore decrescente. Ogni elemento Ã¨ `{ player, best }`.
 *   In caso di paritÃ , ordina alfabeticamente per nome.
 * - `getRank(player)` â†’ posizione nella classifica (1-based) in base al
 *   punteggio migliore; `null` se il giocatore non esiste.
 *
 * Esempi:
 *   const sb = new Scoreboard();
 *   sb.addScore("Alice", 80); sb.addScore("Alice", 95);
 *   sb.addScore("Bob", 90);
 *   sb.getBest("Alice")    â†’ 95
 *   sb.getAverage("Alice") â†’ 87.5
 *   sb.getTopN(2)          â†’ [{ player: "Alice", best: 95 }, { player: "Bob", best: 90 }]
 *   sb.getRank("Bob")      â†’ 2
 */
export class Scoreboard {
  #scores = {};

  addScore(player, score) {
    if (!this.#scores[player]) {
      this.#scores[player] = [];
    }

    this.#scores[player].push(score);
  }

  getBest(player) {
    if (!this.#scores[player]) return null;
    return Math.max(...this.#scores[player]);
  }

  getAverage(player) {
    if (!this.#scores[player]) return null;
    const scores = this.#scores[player];
    const sum = scores.reduce((total, s) => total + s, 0);
    return Math.round((sum / scores.length) * 100) / 100;
  }

  #ranking() {
    return Object.keys(this.#scores)
      .map((player) => ({ player, best: this.getBest(player) }))
      .sort((a, b) => b.best - a.best || a.player.localeCompare(b.player));
  }

  getTopN(n) {
    return this.#ranking().slice(0, n);
  }

  getRank(player) {
    if (!this.#scores[player]) return null;
    const ranking = this.#ranking();
    return ranking.findIndex((entry) => entry.player === player) + 1;
  }
}