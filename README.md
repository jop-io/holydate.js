# holydate.js
JS-klass för att hantera namn på högtidsdagar



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
