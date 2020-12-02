# Kanban Board
M133 Projekt S-INF18aL
## Mitglieder:
 - Aurel Linus Wicki
 - Janis Kneubühler
S-INF18aL
 
## Anleitung Kanban Board:

### Server starten mit deno
```
deno run --allow-net --allow-read api.js
```

### Kanban Board benutzen

#### Kanban Board öffnen
http://localhost:8000/ im Broser öffnen <br>
  ➡ Kanban Board sollte erscheinen

#### Neuen Task erstellen
In jeder Spalte befindet sich ein Plus-Knopf. <br>
Drückt man auf diesen, öffnet sich ein Eingabefenster, in welchem man den Tasktitel eingeben kann. 
Dieser wird dann in der entsprechende Spalte erstellt. 

#### Task verschieben
Ändert sich der Zustand eines Tasks, kann dieser verschoben werden. <br>
Dies kann entweder ganz einfach per Drag and Drop gemacht werden. Dies erfolgt indem man den Task in die entsprechende Spalte unter die Tasks, die sich evtl. bereits in der Spalten befinden, zieht. <br>
Zusätzlich kann auch mit einem Klick auf die Pfeil-Knöpfe den Task verschoben werden.

#### Task löschen
Soll ein bestehender Task gelöscht werden, kann im Knopf der Taskkarte auf den Mülleimer geklickt werden.
