Creá el archivo src/logica.ts con las reglas de Mi Pupusería,
según la ficha de abajo.

REGLAS TÉCNICAS, obligatorias
- TypeScript. Exportá los tipos y el objeto CONFIG con todos los números
  juntos arriba, cada uno con un comentario que diga su unidad.
- Este archivo NO puede tocar la pantalla: nada de document, window, alert ni
  console.log. Solo datos y funciones sobre el estado.
- Cada función que cambia el estado devuelve true si la acción fue válida y
  false si no se pudo hacer.
- Si hace falta azar, usá un generador con semilla y exportalo, para que la
  misma semilla dé siempre el mismo resultado.
- Código y comentarios en español.

REGLAS DE TRABAJO
- Hacé exactamente lo que dice la ficha. Nada más.
- Si algo es ambiguo o imposible, paralo y preguntame antes de inventar.
- Al terminar, listame qué dejaste fuera y qué decidiste vos donde la ficha
  no decía nada.

FICHA:
## 1. Información general

**Nombre del juego:** Mi Pupusería

**En una frase:** Es un juego donde tengo que administrar mi propia pupusería durante 10 días, comprar los ingredientes, elegir los precios y tratar de ganar dinero sin quedarme en bancarrota.

**¿Para quién está dirigido?** Para jóvenes que quieran aprender de una manera divertida cómo se administra un pequeño negocio y cómo se deben controlar los gastos y las ganancias.

**¿Qué quiero lograr con el juego?** Mi objetivo es comenzar con $30.00 y terminar los 10 días con al menos $70.00. Para lograrlo, tengo que comprar bien los ingredientes, elegir precios adecuados y aprovechar los días en los que llegan más clientes.

## 2. Cómo se juega

**Acciones principales:**

1. Comprar los ingredientes que necesito para preparar las pupusas.
2. Elegir el precio de venta: $0.50, $0.75 o $1.00.
3. Revisar el clima del día para tener una idea de cuántos clientes podrían llegar.
4. Abrir la pupusería y esperar los resultados de las ventas.
5. Revisar cuánto dinero gané o perdí para tomar mejores decisiones al día siguiente.

**Gano si…** Termino el día 10 con $70.00 o más.

**Pierdo si…** No tengo suficiente dinero para pagar los $3.00 diarios de gas y leña, o si termino el día 10 con menos de $70.00.

## 3. Lo que aparecerá en la pantalla

* El día actual, por ejemplo, Día 4 de 10.
* El dinero que tengo disponible.
* La cantidad de masa, queso y frijoles que tengo.
* El precio que elegí para vender cada pupusa.
* El clima del día: lluvia, normal o feria.
* Los resultados del día anterior.
* La cantidad de pupusas vendidas y las ganancias o pérdidas.
* Un mensaje que me indique si estoy administrando bien el negocio.

**Idea extra:** Quiero agregar un pequeño consejo al terminar cada día, por ejemplo: “Vendiste bastante, pero gastaste demasiado en ingredientes” o “El precio que elegiste te ayudó a obtener más ganancias”. Así puedo entender mejor mis errores.

## 4. Controles

**Con teclado:**

* Tecla 1: comprar masa.
* Tecla 2: comprar queso.
* Tecla 3: comprar frijoles.
* Flecha izquierda: bajar el precio.
* Flecha derecha: subir el precio.
* Enter: abrir la pupusería y terminar el día.

**Con botones:** También quiero que aparezcan botones grandes en la pantalla para poder jugar fácilmente sin tener que memorizar todas las teclas.

## 5. Diseño y colores

* **Azul oscuro:** fondo principal.
* **Blanco:** textos e información importante.
* **Verde:** ganancias y resultados positivos.
* **Rojo:** pérdidas, falta de dinero o riesgo de quiebra.
* **Amarillo:** precios, clima y mensajes de advertencia.

Quiero que la interfaz sea sencilla, ordenada y fácil de entender, sin demasiadas cosas que distraigan.

## 6. Reglas del negocio

* Cada lote representa 10 pupusas y necesita 1 unidad de masa, 1 de queso y 1 de frijoles.
* Un lote de masa cuesta $1.50.
* Un lote de queso cuesta $2.50.
* Un lote de frijoles cuesta $1.00.
* El costo total de los ingredientes para un lote es de $5.00.
* La masa que no se utiliza se pierde al finalizar el día, mientras que el queso y los frijoles se conservan.
* Los precios disponibles para vender son $0.50, $0.75 y $1.00 por pupusa.
* Cada día se pagan $3.00 de gas y leña.

**Clientes según el precio:**

* A $0.50 pueden llegar aproximadamente 60 clientes.
* A $0.75 pueden llegar aproximadamente 45 clientes.
* A $1.00 pueden llegar aproximadamente 25 clientes.

**Clima del día:**

* Lluvia: 20 % de probabilidad y menos clientes.
* Normal: 60 % de probabilidad y demanda habitual.
* Feria: 20 % de probabilidad y más clientes.

El clima puede cambiar la cantidad de clientes, por lo que no todos los días tendrán el mismo resultado.

## 7. Ideas adicionales que quiero incluir

1. **Racha de buenos días:** si consigo ganancias durante tres días seguidos, aparece un mensaje de felicitación para motivarme a seguir administrando bien el negocio.
2. **Récord personal:** al terminar la partida, el juego muestra cuánto dinero logré acumular y cuál fue mi mejor día.
3. **Consejos para ahorrar:** si compro demasiada masa y no la utilizo, el juego me recuerda que debo calcular mejor cuánto necesito.
4. **Resumen final:** al terminar los 10 días, aparece un informe con el dinero inicial, los ingresos por ventas, los gastos, la ganancia total y el resultado final.
5. **Dificultad por decisiones:** no quiero que el juego sea solamente comprar y vender; quiero que tenga decisiones que me hagan pensar antes de gastar mi dinero.

Estas ideas se mantendrán sencillas para que el juego sea fácil de programar y no se vuelva demasiado complicado.

## 8. Lo que no incluirá

Por ahora, el juego no tendrá préstamos, empleados, diferentes tipos de pupusas, sonidos, guardado de partidas ni imágenes. Prefiero comenzar con una versión sencilla que funcione correctamente y después pensar en otras mejoras.

## 9. Criterio de aceptación

El juego estará listo cuando pueda iniciarlo con $30.00, comprar ingredientes, cambiar el precio, abrir la pupusería y ver los resultados de cada día. También deberá mostrar correctamente los gastos, los ingresos y las ganancias o pérdidas.

Al completar los 10 días, el juego debe indicar claramente si logré alcanzar la meta de $70.00 o si perdí.

## 10. ¿Qué quiero aprender con este juego?

Quiero aprender que tener un negocio no significa solamente vender mucho, sino también saber cuánto gasto, cuánto cobro y cuánto dinero me queda. Además, quiero practicar la programación de un juego que utilice variables, condiciones, ciclos, números aleatorios y cálculos de dinero.

**Mi idea es que el juego sea sencillo, entretenido y que enseñe algo útil sobre cómo administrar una pupusería en la vida real.**

Dos detalles importantes para que el juego no tenga errores

Hay dos cosas que te recomiendo tener en cuenta al momento de programarlo:

La cantidad de ingredientes: si compras dos lotes de cada ingrediente, tienes ingredientes para 20 pupusas. Por eso, aunque la demanda sea de 25, 45 o 60 clientes, solo podrás vender las pupusas que tengas disponibles.

La meta de dinero: con dos lotes completos por día y un precio de $1.00, la ganancia sería de $7.00 diarios si vendes las 20 pupusas. Después de 10 días tendrías $100.00, siempre que puedas repetir esa estrategia y no tengas pérdidas adicionales.

Lo que el agente dijo--
Decisiones y reglas aplicadas

La demanda usa los multiplicadores por clima y la variación diaria de ±10 % que elegiste; se redondea al cliente más cercano.
Cada compra agrega un lote. Se venden como máximo las pupusas que permiten los ingredientes disponibles; la masa sobrante se pierde al cerrar el día y queso y frijoles se conservan.
El precio inicial es $0.75. Los montos se guardan en centavos.
Se cobra gas y leña al abrir. Si no alcanza el dinero, la partida termina en bancarrota.
La ganancia diaria resta los ingredientes comprados ese día y el gas a los ingresos. El récord y el mejor día corresponden a la partida actual.
Dejé fuera la interfaz, los botones y controles de teclado, y las funciones de pantalla: este archivo contiene solo la lógica. También quedan fuera préstamos, empleados, sonidos, guardado e imágenes, tal como indica la ficha.

npm run build pasó. También verifiqué la repetibilidad de la semilla, la estrategia de $100 al final de los 10 días y la condición de bancarrota.




P2
Escribí pruebas con Vitest para src/logica.ts, en test/logica.test.ts.

Como mínimo cinco, y tienen que cubrir:
1. Que el estado inicial se arme bien.
2. Cada acción del usuario: qué hace cuando es válida y qué devuelve cuando no.
3. Que no se pueda hacer una acción prohibida por las reglas.
4. La condición de «termina bien» y la de «termina mal» de mi ficha.
5. UNA PRUEBA QUE RECORRA UN USO COMPLETO de principio a fin y compruebe que
   SE PUEDE LLEGAR AL FINAL BUENO.

Los nombres de las pruebas en español y en forma de frase.
No modifiques src/logica.ts. Al terminar corré npm test y pegame el resultado.