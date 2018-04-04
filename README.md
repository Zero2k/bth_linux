Kmom10: Projekt och examination
==================================

Detta kursmoment avslutar och examinerar kursen.

Upplägget är enligt följande:

* Projektet och redovisning (20-80h)

Totalt omfattar kursmomentet (07/10) ca 20+20+20+20 studietimmar.



Bedömning och betygsättning
--------------------------------------------------------------------

När du lämnat in projektet bedöms det tillsammans med dina tidigare redovisade kursmoment och du får ett slutbetyg på kursen. Läs om [grunderna för bedömning och betygsättning](https://dbwebb.se/kurser/bedomning-och-betygsattning).



Projektidé och upplägg
--------------------------------------------------------------------

Du är nyanställd på webbfirman AB Konsult Mobila Webappar. De är osäkra på dina kunskaper och ger dig ett projekt som blivit liggande. De säger "Kan du fixa ihop en RESTful server med Node.js som vi kan använda för att testa BTH's mobila app?".

Du säger "Självklart. Finns det något att utgå ifrån?"

Du får en länk till en [katalog på en projektserver](https://github.com/mosbth/linux/tree/master/example/proj). Sedan lämnar de dig åt ditt öde.

Du hittar alltså filer som är relaterade till projektet i ditt kursrepo under `example/proj`.

Du kikar snabbt i katalogen och väljer att fokusera på en server som söker bland salarna. Det låter lagom stort. Det blir ditt bidrag till *bthappen*.

Fråga i forumet om du känner dig osäker.



Projektspecifikation
--------------------------------------------------------------------

Utveckla och leverera projektet enligt följande specifikationen. Saknas info i specen så kan du själv välja väg, dokumentera dina val i redovisningstexten.

De tre första kraven är obligatoriska och måste lösas för att få godkänt på uppgiften. De tre sista kraven är optionella krav. Lös de optionella kraven för att samla poäng och därmed nå högre betyg.

Varje krav ger max 10 poäng, totalt är det 60 poäng.



### Kataloger för redovisning

Samla alla dina filer för projektet i ditt kursrepo under `me/kmom10/bthappen`.

Redovisningstexten skriver du som vanligt i `me/redovisa`.



### Krav 1 Bash för att konvertera XLS till JSON

Administrationen har fixat ett excelark som visar samtliga salar på BTH i Karlshamn och i Karlskrona. Du behöver omvandla innehållet i excelarket till en JSON-fil.

Du hittar excelarket i ditt kursrepo under `example/proj/resources`. Information i excelarket ser ut ungefär så här.

```text
H430	Unixlabb			Karlskrona	H-huset	4	Labrationssal
A303	Monsunen			Karlskrona	A-huset	3	Konferensrum	18
```

Det skall omformas till JSON-fil enligt följande.

```javascript
{
    "salar": [
        {
            "Salsnr": "A303",
            "Salsnamn": "Monsunen",
            "Lat": null,
            "Long": null,
            "Ort": "Karlskrona",
            "Hus": "A-huset",
            "Våning": "3",
            "Typ": "Konferensrum",
            "Storlek": "18"
        },
        {
            "Salsnr": "H430",
            "Salsnamn": "Unixlabb",
            "Lat": null,
            "Long": null,
            "Ort": "Karlskrona",
            "Hus": "H-huset",
            "Våning": "4",
            "Typ": "Labrationssal",
            "Storlek": null
        }
    ]
}
```

Skapa ett Bash-script som automatiskt skapar en JSON-fil utifrån innehållet i excelarket. Du får förbereda datan genom att spara excelarket i valfritt format, förslagsvis `.csv`, så att ditt Bash-skript kan läsa dess innehåll.

Döp ditt Bash-script till `bthappen/salar2json.bash`. När skriptet körs så skall det skapas en fil `bthappen/salar.json` som innehåller samtliga salar enligt strukturen ovan.

Använd ett onlineverktyg för att kontrollera att du producerat JSON som validerar.



### Krav 2 Server för att visa och söka bland salar

Skapa en server i Node.js (ES6) som kan visa och söka bland salar via följande routes. Alla svar skall vara i JSON. Servern skall använda sig av routern (som användes i kmom05/06).

| Route                     | Resultat |
|---------------------------|----------|
| `/`                       | Visa en lista av de routes som stöds. |
| `/room/list`              | Visa samtliga salar. |
| `/room/view/id/:number`   | Visa detaljer om salen med valt salsnummer. |
| `/room/view/house/:house` | Visa samtliga salar som finns i ett visst hus. |
| `/room/search/:search`    | Visa de salar som matchar söksträngen. Sökning skall ske på delsträng i samtliga fält. |

Spara koden för servern, och det som servern behöver, i en underkatalog `bthappen/server`. Servern skall startas på följande sätt där man kan ange vilken port som servern skall använda.

```text
bthappen/server/index.js --port <number>
```

Servern skall även stödja options för `-h` och `-v` för att visa en hjälptext samt versionen på programmet.

Servern skall skriva ut en loggtext som visar vilken route den tar emot, från vilken klient (hostnamnet/ip-adressen).



### Krav 3 Klient i Node.js för att testköra mot servern

Skapa en klient i Node.js (ES6) som du använder för att testa servern. Din klient skall vara byggd likt den klient du gjorde i kmom06. Den skall använda en egen prompt med modulen readline samt innehålla ett menysystem som ser ut så här.

```text
Commands available:

 exit            Leave this program.
 menu            Print this menu.
 url             Get url to view the server in browser.
 list            List all rooms.
 view <id>       View the room with the selected id.
 house <house>   View the names of all rooms in this building (house).
 search <string> View the details of all matching rooms (one per row).
```

Spara koden för klienten, och det som klienten behöver, i en underkatalog `bthappen/client`. Klienten skall startas på följande sätt där man kan ange vilken server och port som klienten skall använda för att koppla upp sig.

```text
bthappen/client/index.js --server <server> --port <number>
```

Klienten skall stödja options för `-h` och `-v` för att visa en hjälptext samt versionen på programmet.



### Krav 4: Bättre sökalgoritm (optionell)

Förbättra sökalgoritmen genom att införa prioritering och skapa en ny route (server och klient) som söker med prioritering.

| Route                     | Resultat |
|---------------------------|----------|
| `/room/searchp/:search`   | Sök med prioritering. |


Du väljer själv den algoritm du implementerar. Tänk på följande.

1. Vissa fält är mer viktiga än andra. De har högre prioritet och en träff i dem är viktigare än en träff i andra fält.

1. Om söksträngen matchar ett helt fält, inte bara en delsträng av fältet, så har det hög prioritet.

1. Om söksträngen matchar början av strängen så har det högre prioritet än en matchning av delsträng inuti. Det är alltså bättre om söksträngen `abc` matchar `abcdef` än `defabc`.

Skapa din egen sökalgoritm som väger in prioritering och graderar varje sökträff till en siffra mellan 0 och 1. Sortera svaret som servern skickar baserat på prioritering. Värdet på prioriteringen skall skickas med svaret.



### Krav 5: Filtrera antalet träffar (optionell)

Lägg till så man kan filtrera det resultatet man får så man bara får max ett visst antal träffar.

| Route                     | Resultat |
|---------------------------|----------|
| `max=number`              | Svaret skall innehålla max *number* träffar. |

Följande routes skall stödja filtreringen.

| Route                     | Resultat |
|---------------------------|----------|
| `/room/list`              | Visa samtliga salar. |
| `/room/view/house/:house` | Visa samtliga salar som finns i ett visst hus. |
| `/room/search/:search`    | Visa de salar som matchar söksträngen. |

Ett exempel är alltså `/room/search/karlskrona?max=5` som ger ett svar med max 5 salar.



### Krav 6: Bättre testmöjligheter (optionell)

Bygg ut ditt system med bättre möjligheter för tester.

I servern, lägg till en option av `--develop` som innebär utskrift av svaret som skickas till klienten. På det viset kan man på serversidan se exakt vilket svar som skickas på en viss request.

I klienten, lägg till en option av `--develop` som innebär utskrift av urlen som skickas till servern.

Skapa ett bash-skript `bthappen/test.bash` som använder curl för att testa samtliga router (minst 15 testfall). Bash-skriptet skall skriva ut urlen som testas följt av den response kod som kommer från servern. Skriptet skall stödja LINUX_SERVER och LINUX_PORT.

Bash-skriptet skall ha en option `--verbose` som innebär att den skriver ut innehållet i det svaret som kommer från servern.
