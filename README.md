# holydate.js
JS-klass för att hantera namn på högtidsdagar

## Registrera och kontrollera högtidsdagar
Klassen innehåller två grundmetoder, `.set()` för att registrera högtidsdagar och `.get()` för att kontrollera om ett datum är en högtidsdag.

### .set()
För att registrera en högtidsdag används funktionen `.set()`. Olika typer av högtidsdagar har olika regler för vilket datum de infaller, se [typer för datumberäkning](https://github.com/jop-io/holydate.js#typer-för-datumberäkning) för mer information.

```javascript
var hd = new Holydate();

hd.set('Julafton').date().month(12).day(24);
```

### .get()
För att kontrollera om ett datum är en högtidsdag används funktionen `.get()`. Beroende på vilka högtidsdagar som har registrerats kan ett och samma datum ha fler än en bemäning. Av denna anledning returneras en array innehållades namnen på de högtidsdagar som matchar angivet datum. Om angivet datum inte matchar någon av de registrerade högtidsdagarna returneras istället `null`.

```javascript
var hd = new Holydate();

hd.set('Första maj').date().month(5).day(1);
hd.set('Nyårsafton').date().month(12).day(31);
hd.set('Min födelsedag').date().month(12).day(31);

hd.get('2016-05-01'); // Returnerar ["Första maj"]
hd.get('2016-12-24'); // Returnerar ["Nyårsafton", "Min födelsedag"]
hd.get('2016-10-01'); // Returnerar null
```



## Typer för datumberäkning

###.date()
Används för att beräkna högtidsdagar som alltid infaller på fasta datum, tex. *Julafton*, *Första maj* och *Sveriges nationaldag*.

För att registrera högtidsdagar på fasta datum kedjas `.date()` till `.month()` och `.day()`, tex:
```javascript
var hd = new Holydate();

hd.set('Julafton').date().month(12).day(24);
hd.set('Första maj').date().month(5).day(1);
hd.set('Nationaldagen').date().month(6).day(6);
```

###.easter()
Används för att beräkna högtidsdagar som infaller relativt till Påskdagen, tex. *Askonsdagen*, *Långfredagen*, *Påskdagen*, *Kristi himmelfärdsdag* och *Pingsdagen*.

För att registrera högtidsdagar relativa till Påskdagens datum, kedjas `.easter()` till `.offset()`, tex:

```javascript
var hd = new Holydate();

hd.set('Askonsdagen').easter().offset(-46);
hd.set('Långfredagen').easter().offset(-1);
hd.set('Påskdagen').easter(); // Ingen avvikelse behöver anges för påskdagen
hd.set('Kristi himmelfärdsdag').easter().offset(39);
hd.set('Pingsdagen').easter().offset(49);
```

###.weekday()
Används för att beräkna högtidsdagar som alltid infaller på fast veckodagar (mån-sön), men på varierade datum, tex. *Midsommarafton*, *Alla helgons dag* och *Första advent*.

Vid användning av `.weekday()` måste veckodagens index anges som argument (1=mån ... 7=sön), tex. `.weekday(5)` för en fredag.

För att registrera en högtidsdag som infaller på en fast veckodag **MÅSTE** `.weekday()` kedjas till `.month()`.

Högtidsdagar på fasta veckodagar har vanligtvis olika regler för när de infaller, följande funktioner kan kedjas till `.weekday()` för att precisera när veckodagen infaller:

* `.day()` - Specificerar från vilken dag beräkning av datum ska börja
* `.interval()` - Specificerar ett intervall (antal veckor) som måste passera innan veckodagen inträffar
* `.first()` - Specificerar att den första förekommande veckodagen är den som eftersöks*
* `.last()` - Specificerar att den sista förekommande veckodagen är den som eftersöks*

&ast; *Om inte `.first()` eller `.last()` specificeras, eftersök alltid den första förekommande veckodagen.*

#### Exempel för första förekomsten av en veckodag
```javascript
var hd = new Holydate();

// Midsommarafton infaller alltid på en fredag, som tidigast den 19 juni
// Utgå ifrån månad 6 (jun) och dag 19, hitta veckodag 5 (fre)
hd.set('Midsommarafton').weekday(5).month(6).day(19);

// Alla helgons dag infaller alltid på en lördag, som tidigast den 31 oktober
// Utgå ifrån månad 10 (okt) och dag 31, hitta veckodag 6 (lör)
hd.set('Alla helgons dag').weekday(6).month(10).day(31);

// Första advent infaller alltid på en söndag, som tidigast den 27 november
// Utgå ifrån månad 11 (nov) och dag 27, hitta veckodag 7 (sön)
hd.set('Första advent').weekday(7).month(11).day(27);
```

#### Exempel för första förekomsten av en veckodag efter ett intervall
Fars dag firas alltid den andra söndagen i november. För att specificera att det är just den andra söndagen som eftersök kedjas funktionen `.interval(2)`:

```javascript
var hd = new Holydate();

// Fars dag infaller alltid den andra söndagen i november
// Utgå ifrån månad 11 (nov) och dag 1, hitta den andra förekomsten (2) av veckodag 7 (sön)
hd.set('Fars dag').weekday(7).interval(2).month(11).day(1);
```

#### Exempel för sista förekomsten av en veckodag
Mors dag firas alltid den sista söndagen i maj. För att specificera att det är just den sista söndagen som eftersök kedjas funktionen `.last()`:

```javascript
var hd = new Holydate();

// Mors dag infaller alltid den sista söndagen i maj
// Utgå ifrån månad 5 (maj) och dag 1, hitta den sista förekomsten av veckodag 7 (sön)
hd.set('Mors dag').weekday(7).last().month(5).day(1);
```

# Förteckning över svenska högtidsdagar
```javascript
var hd = new Holydate();

// Högtidsdagar på fasta datum
hd.set('Nyårsdagen').date().month(1).day(1);
hd.set('Trettondagsafton').date().month(1).day(5);
hd.set('Trettondedag jul').date().month(1).day(6);
hd.set('Alla hjärtans dag').date().month(2).day(14);
hd.set('Valborgsmässoafton').date().month(4).day(30);
hd.set('Första maj').date().month(5).day(1);
hd.set('Sveriges nationaldag').date().month(6).day(6);
hd.set('Julafton').date().month(12).day(24);
hd.set('Juldagen').date().month(12).day(25);
hd.set('Annandag jul').date().month(12).day(26);
hd.set('Nyårsafton').date().month(12).day(31);

// Högtidsdagar relaterade till påskdagen
hd.set('Fettisdagen').easter().offset(-47);
hd.set('Askonsdagen').easter().offset(-46);
hd.set('Palmsöndagen').easter().offset(-7);
hd.set('Dymmelonsdagen').easter().offset(-3);
hd.set('Skärtorsdagen').easter().offset(-2);
hd.set('Långfredagen').easter().offset(-1);
hd.set('Påskdagen').easter().offset(0);
hd.set('Annandag påsk').easter().offset(1);
hd.set('Kristi himmelfärdsdag').easter().offset(39);
hd.set('Pingstafton').easter().offset(48);
hd.set('Pingsdagen').easter().offset(49);

// Högtidsdagar på fasta veckodagar, med rörliga datum
hd.set('Jungfru Marie bebådelsedag').weekday(7).month(3).day(22);
hd.set('Mors dag').weekday(7).month(5).day(1).last();
hd.set('Midsommarafton').weekday(5).month(6).day(19);
hd.set('Midsommardagen').weekday(6).month(6).day(20);
hd.set('Allhelgonaafton').weekday(5).month(10).day(30);
hd.set('Alla helgons dag').weekday(6).month(10).day(31);
hd.set('Fars dag').weekday(7).month(11).day(1).interval(2);
hd.set('Första advent').weekday(7).month(11).day(27);
hd.set('Andra advent').weekday(7).month(12).day(4);
hd.set('Tredje advent').weekday(7).month(12).day(11);
hd.set('Fjärde advent').weekday(7).month(12).day(18);
```

