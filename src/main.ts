import './estilo.css'
import {
  CONFIG,
  abrirPupuseria,
  cambiarPrecio,
  comprarIngrediente,
  crearPartida,
  type EstadoPartida,
  type Ingrediente,
  type ResultadoDia,
} from './logica.ts'

function obtenerContenedor(): HTMLDivElement {
  const contenedor = document.querySelector<HTMLDivElement>('#app')
  if (!contenedor) {
    throw new Error('No se encontró el contenedor principal de Mi Pupusería.')
  }
  return contenedor
}

const app = obtenerContenedor()
let partida: EstadoPartida | undefined
let mensaje = ''

function formatearDinero(centavos: number): string {
  return `$${(centavos / 100).toFixed(2)}`
}

function mostrarInicio(): void {
  app.innerHTML = `
    <main class="pantalla pantalla-inicio">
      <section class="tarjeta inicio-tarjeta" aria-labelledby="titulo-juego">
        <p class="sobrelinea">Un pequeño negocio, grandes decisiones</p>
        <h1 id="titulo-juego">Mi Pupusería</h1>
        <p class="descripcion">Administrá tu pupusería durante 10 días. Comprá ingredientes, elegí tus precios y cuidá tus ganancias.</p>
        <div class="meta-inicio">
          <span>Capital inicial <strong>${formatearDinero(CONFIG.dineroInicialCentavos)}</strong></span>
          <span>Meta final <strong>${formatearDinero(CONFIG.dineroMetaCentavos)}</strong></span>
        </div>
        <button class="boton boton-principal boton-grande" type="button" data-accion="iniciar">Iniciar partida</button>
        <p class="ayuda-teclado">También podés usar 1, 2, 3 para comprar; ← y → para cambiar el precio; Enter para abrir.</p>
      </section>
    </main>
  `
}

function mostrarCompra(
  ingrediente: Ingrediente,
  etiqueta: string,
  costoCentavos: number,
  tecla: string,
): string {
  return `
    <button class="boton boton-compra" type="button" data-accion="comprar" data-ingrediente="${ingrediente}">
      <span class="tecla">${tecla}</span>
      <span class="boton-texto">Comprar ${etiqueta}<small>${formatearDinero(costoCentavos)} por lote</small></span>
    </button>
  `
}

function mostrarResultado(resultado: ResultadoDia | undefined): string {
  if (!resultado) {
    return '<p class="sin-resultado">Todavía no hay resultados. Comprá ingredientes y abrí la pupusería.</p>'
  }

  const claseGanancia = resultado.gananciaCentavos >= 0 ? 'positivo' : 'negativo'
  return `
    <div class="resultado-cifras">
      <p><span>Pupusas vendidas</span><strong>${resultado.pupusasVendidas}</strong></p>
      <p><span>Ingresos</span><strong>${formatearDinero(resultado.ingresosCentavos)}</strong></p>
      <p><span>Gastos del día</span><strong>${formatearDinero(resultado.gastosCentavos)}</strong></p>
      <p class="${claseGanancia}"><span>Ganancia / pérdida</span><strong>${formatearDinero(resultado.gananciaCentavos)}</strong></p>
    </div>
    <p class="consejo">${resultado.consejo}</p>
    ${resultado.mensajeRacha ? `<p class="aviso-racha">${resultado.mensajeRacha}</p>` : ''}
  `
}

function mostrarJuego(): void {
  if (!partida) {
    mostrarInicio()
    return
  }

  const resultadoAnterior = partida.resultados.at(-1)
  app.innerHTML = `
    <main class="pantalla pantalla-juego">
      <header class="encabezado">
        <div>
          <p class="sobrelinea">Mi Pupusería</p>
          <h1>Día ${partida.diaActual} de ${CONFIG.diasTotales}</h1>
        </div>
        <div class="dinero-panel">
          <span>Dinero disponible</span>
          <strong>${formatearDinero(partida.dineroCentavos)}</strong>
        </div>
      </header>

      <section class="tablero">
        <article class="tarjeta clima-panel">
          <div>
            <p class="etiqueta">Clima de hoy</p>
            <h2 class="clima clima-${partida.climaDelDia}">${partida.climaDelDia}</h2>
          </div>
          <p class="detalle-clima">El clima influye en la cantidad de clientes.</p>
        </article>

        <article class="tarjeta inventario-panel">
          <p class="etiqueta">Ingredientes disponibles</p>
          <dl class="inventario">
            <div><dt>Masa</dt><dd>${partida.inventario.masa} lotes</dd></div>
            <div><dt>Queso</dt><dd>${partida.inventario.queso} lotes</dd></div>
            <div><dt>Frijoles</dt><dd>${partida.inventario.frijoles} lotes</dd></div>
          </dl>
        </article>
      </section>

      <section class="tarjeta controles" aria-labelledby="titulo-compras">
        <div class="seccion-titulo">
          <div><p class="etiqueta">Prepará el día</p><h2 id="titulo-compras">Comprar ingredientes</h2></div>
          <p class="nota">Cada lote rinde 10 pupusas</p>
        </div>
        <div class="fila-botones">
          ${mostrarCompra('masa', 'masa', CONFIG.costoLoteMasaCentavos, '1')}
          ${mostrarCompra('queso', 'queso', CONFIG.costoLoteQuesoCentavos, '2')}
          ${mostrarCompra('frijoles', 'frijoles', CONFIG.costoLoteFrijolesCentavos, '3')}
        </div>
      </section>

      <section class="tarjeta controles precio-panel" aria-labelledby="titulo-precio">
        <div class="seccion-titulo">
          <div><p class="etiqueta">Precio de venta</p><h2 id="titulo-precio">Por pupusa</h2></div>
          <strong class="precio-actual">${formatearDinero(partida.precioCentavosPorPupusa)}</strong>
        </div>
        <div class="fila-botones fila-precio">
          <button class="boton boton-secundario" type="button" data-accion="precio" data-direccion="bajar" aria-label="Bajar precio">← Bajar precio</button>
          <span class="opciones-precio">$0.50 · $0.75 · $1.00</span>
          <button class="boton boton-secundario" type="button" data-accion="precio" data-direccion="subir" aria-label="Subir precio">Subir precio →</button>
        </div>
      </section>

      ${mensaje ? `<p class="mensaje-estado" role="status">${mensaje}</p>` : ''}

      <section class="tarjeta informe-panel" aria-live="polite">
        <div class="seccion-titulo">
          <div><p class="etiqueta">${resultadoAnterior ? `Resultado del día ${resultadoAnterior.dia}` : 'Tu informe'}</p><h2>${resultadoAnterior ? 'Así te fue' : 'Resumen diario'}</h2></div>
          <span class="costo-fijo">Gas y leña: ${formatearDinero(CONFIG.costoGasYLenaCentavos)} / día</span>
        </div>
        ${mostrarResultado(resultadoAnterior)}
      </section>

      <button class="boton boton-principal boton-abrir" type="button" data-accion="abrir">Abrir pupusería y terminar el día <span>↵</span></button>
    </main>
  `
}

function mostrarFinal(): void {
  if (!partida?.resumenFinal) {
    mostrarJuego()
    return
  }

  const resumen = partida.resumenFinal
  const exito = resumen.alcanzoMeta
  const mejorDia = resumen.mejorDia
  const encabezado = resumen.motivo === 'bancarrota'
    ? 'La pupusería se quedó sin fondos'
    : exito
      ? '¡Meta alcanzada!'
      : 'No se alcanzó la meta'
  const explicacion = resumen.motivo === 'bancarrota'
    ? 'No quedó dinero suficiente para pagar el gas y la leña.'
    : exito
      ? `Terminaste con ${formatearDinero(resumen.dineroFinalCentavos)}, superando la meta de ${formatearDinero(CONFIG.dineroMetaCentavos)}.`
      : `Terminaste con ${formatearDinero(resumen.dineroFinalCentavos)}. La meta era ${formatearDinero(CONFIG.dineroMetaCentavos)}.`

  app.innerHTML = `
    <main class="pantalla pantalla-final">
      <section class="tarjeta final-tarjeta">
        <p class="sobrelinea">Partida terminada</p>
        <h1 class="${exito ? 'positivo' : 'negativo'}">${encabezado}</h1>
        <p class="descripcion">${explicacion}</p>
        <div class="resumen-final">
          <p><span>Dinero inicial</span><strong>${formatearDinero(resumen.dineroInicialCentavos)}</strong></p>
          <p><span>Ingresos por ventas</span><strong>${formatearDinero(resumen.ingresosTotalesCentavos)}</strong></p>
          <p><span>Gastos totales</span><strong>${formatearDinero(resumen.gastosTotalesCentavos)}</strong></p>
          <p><span>Ganancia total</span><strong>${formatearDinero(resumen.gananciaTotalCentavos)}</strong></p>
          <p class="total-final"><span>Dinero final</span><strong>${formatearDinero(resumen.dineroFinalCentavos)}</strong></p>
        </div>
        <p class="mejor-dia">${mejorDia
          ? `Tu mejor día fue el día ${mejorDia.dia}, con ${formatearDinero(mejorDia.gananciaCentavos)} de ganancia.`
          : 'No hubo días abiertos para comparar.'}</p>
        <button class="boton boton-principal boton-grande" type="button" data-accion="reiniciar">Jugar de nuevo</button>
      </section>
    </main>
  `
}

function dibujar(): void {
  if (!partida) {
    mostrarInicio()
  } else if (partida.terminado) {
    mostrarFinal()
  } else {
    mostrarJuego()
  }
}

function iniciarPartida(): void {
  partida = crearPartida(Date.now())
  mensaje = ''
  dibujar()
}

function ejecutarAccion(
  accion: string,
  datos: { ingrediente?: string; direccion?: string } = {},
): void {
  if (accion === 'iniciar' || accion === 'reiniciar') {
    iniciarPartida()
    return
  }
  if (!partida || partida.terminado) {
    return
  }

  let valida = false
  if (
    accion === 'comprar' &&
    (datos.ingrediente === 'masa' ||
      datos.ingrediente === 'queso' ||
      datos.ingrediente === 'frijoles')
  ) {
    valida = comprarIngrediente(partida, datos.ingrediente)
    mensaje = valida ? 'Ingrediente agregado al inventario.' : 'No hay dinero suficiente para esa compra.'
  } else if (accion === 'precio') {
    const direccion = datos.direccion
    if (direccion === 'subir' || direccion === 'bajar') {
      valida = cambiarPrecio(partida, direccion)
      mensaje = valida ? 'Precio actualizado.' : 'Ese es el límite de precio disponible.'
    }
  } else if (accion === 'abrir') {
    valida = abrirPupuseria(partida)
    mensaje = valida ? '' : 'No se pudo abrir la pupusería.'
  }

  if (!valida && !mensaje) {
    mensaje = 'No se pudo realizar esa acción.'
  }
  dibujar()
}

app.addEventListener('click', (evento: MouseEvent) => {
  const objetivo = evento.target
  if (!(objetivo instanceof Element)) {
    return
  }
  const boton = objetivo.closest<HTMLButtonElement>('[data-accion]')
  if (boton) {
    ejecutarAccion(boton.dataset.accion ?? '', {
      ingrediente: boton.dataset.ingrediente,
      direccion: boton.dataset.direccion,
    })
  }
})

document.addEventListener('keydown', (evento: KeyboardEvent) => {
  if (!partida) {
    if (evento.key === 'Enter') {
      iniciarPartida()
    }
    return
  }
  if (partida.terminado) {
    if (evento.key === 'Enter') {
      iniciarPartida()
    }
    return
  }

  if (evento.key === '1' || evento.key === '2' || evento.key === '3') {
    evento.preventDefault()
    const ingrediente: Ingrediente =
      evento.key === '1' ? 'masa' : evento.key === '2' ? 'queso' : 'frijoles'
    const boton = app.querySelector<HTMLButtonElement>(
      `[data-accion="comprar"][data-ingrediente="${ingrediente}"]`,
    )
    if (boton) ejecutarAccion('comprar', { ingrediente })
  } else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowRight') {
    evento.preventDefault()
    ejecutarAccion('precio', {
      direccion: evento.key === 'ArrowLeft' ? 'bajar' : 'subir',
    })
  } else if (evento.key === 'Enter') {
    evento.preventDefault()
    ejecutarAccion('abrir')
  }
})

dibujar()
