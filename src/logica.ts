export type Ingrediente = 'masa' | 'queso' | 'frijoles'

export type Clima = 'lluvia' | 'normal' | 'feria'

export type PrecioPupusa = 50 | 75 | 100

export type GeneradorAleatorio = {
  siguiente: () => number
}

export type ResultadoDia = {
  dia: number
  clima: Clima
  clientesEstimados: number
  pupusasVendidas: number
  ingresosCentavos: number
  gastosCentavos: number
  gananciaCentavos: number
  masaDesperdiciada: number
  mensajeRacha?: string
  consejo: string
}

export type RegistroHistorialDinero = {
  dia: number
  dineroCentavos: number
  gananciaCentavos: number
}

export type ResumenFinal = {
  dineroInicialCentavos: number
  ingresosTotalesCentavos: number
  gastosTotalesCentavos: number
  gananciaTotalCentavos: number
  dineroFinalCentavos: number
  mejorDia?: ResultadoDia
  alcanzoMeta: boolean
  motivo: 'meta' | 'dias_completados' | 'bancarrota'
}

export type EstadoPartida = {
  diaActual: number
  dineroCentavos: number
  inventario: Record<Ingrediente, number>
  precioCentavosPorPupusa: PrecioPupusa
  climaDelDia: Clima
  resultados: ResultadoDia[]
  historialDinero: RegistroHistorialDinero[]
  rachaGanancias: number
  ingresosTotalesCentavos: number
  gastosTotalesCentavos: number
  gastosDelDiaCentavos: number
  terminado: boolean
  resumenFinal?: ResumenFinal
  generadorAleatorio: GeneradorAleatorio
}

export const CONFIG = {
  dineroInicialCentavos: 3000, // centavos
  diasTotales: 10, // días
  dineroMetaCentavos: 7000, // centavos
  costoGasYLenaCentavos: 300, // centavos por día
  costoLoteMasaCentavos: 150, // centavos por lote
  costoLoteQuesoCentavos: 250, // centavos por lote
  costoLoteFrijolesCentavos: 100, // centavos por lote
  pupusasPorLote: 10, // pupusas por lote
  precioInicialCentavos: 75, // centavos por pupusa
  preciosCentavosPorPupusa: [
    50, // centavos por pupusa
    75, // centavos por pupusa
    100, // centavos por pupusa
  ] as const,
  clientesBasePorPrecio: {
    50 /* centavos por pupusa */: 60, // clientes por día
    75 /* centavos por pupusa */: 45, // clientes por día
    100 /* centavos por pupusa */: 25, // clientes por día
  },
  probabilidadLluvia: 0.2, // probabilidad entre 0 y 1
  probabilidadNormal: 0.6, // probabilidad entre 0 y 1
  probabilidadFeria: 0.2, // probabilidad entre 0 y 1
  multiplicadorLluvia: 0.7, // factor de demanda sin unidad
  multiplicadorNormal: 1, // factor de demanda sin unidad
  multiplicadorFeria: 1.3, // factor de demanda sin unidad
  variacionAleatoriaDemanda: 0.1, // proporción máxima de variación de demanda
  multiplicadorGenerador: 1664525, // constante del generador sin unidad
  incrementoGenerador: 1013904223, // constante del generador sin unidad
  moduloGenerador: 4294967296, // estados posibles del generador
} as const

const COSTOS_POR_INGREDIENTE: Record<Ingrediente, number> = {
  masa: CONFIG.costoLoteMasaCentavos,
  queso: CONFIG.costoLoteQuesoCentavos,
  frijoles: CONFIG.costoLoteFrijolesCentavos,
}

const MENSAJE_RACHA = '¡Felicitaciones! Llevás tres días seguidos con ganancias.'

export function crearGeneradorAleatorio(semilla: number): GeneradorAleatorio {
  if (!Number.isFinite(semilla)) {
    throw new RangeError('La semilla debe ser un número finito.')
  }

  let estado = Math.trunc(semilla) % CONFIG.moduloGenerador
  if (estado < 0) {
    estado += CONFIG.moduloGenerador
  }

  return {
    siguiente: () => {
      estado =
        (estado * CONFIG.multiplicadorGenerador + CONFIG.incrementoGenerador) %
        CONFIG.moduloGenerador
      return estado / CONFIG.moduloGenerador
    },
  }
}

function sortearClima(generador: GeneradorAleatorio): Clima {
  const sorteo = generador.siguiente()
  if (sorteo < CONFIG.probabilidadLluvia) {
    return 'lluvia'
  }
  if (sorteo < CONFIG.probabilidadLluvia + CONFIG.probabilidadNormal) {
    return 'normal'
  }
  return 'feria'
}

function obtenerMultiplicadorClima(clima: Clima): number {
  switch (clima) {
    case 'lluvia':
      return CONFIG.multiplicadorLluvia
    case 'normal':
      return CONFIG.multiplicadorNormal
    case 'feria':
      return CONFIG.multiplicadorFeria
  }
}

export function crearPartida(semilla: number): EstadoPartida {
  const generadorAleatorio = crearGeneradorAleatorio(semilla)
  return {
    diaActual: 1,
    dineroCentavos: CONFIG.dineroInicialCentavos,
    inventario: { masa: 0, queso: 0, frijoles: 0 },
    precioCentavosPorPupusa: CONFIG.precioInicialCentavos,
    climaDelDia: sortearClima(generadorAleatorio),
    resultados: [],
    historialDinero: [],
    rachaGanancias: 0,
    ingresosTotalesCentavos: 0,
    gastosTotalesCentavos: 0,
    gastosDelDiaCentavos: 0,
    terminado: false,
    generadorAleatorio,
  }
}

export function comprarIngrediente(
  partida: EstadoPartida,
  ingrediente: Ingrediente,
): boolean {
  if (partida.terminado) {
    return false
  }

  const costo = COSTOS_POR_INGREDIENTE[ingrediente]
  if (partida.dineroCentavos < costo) {
    return false
  }

  partida.dineroCentavos -= costo
  partida.inventario[ingrediente] += 1
  partida.gastosDelDiaCentavos += costo
  partida.gastosTotalesCentavos += costo
  return true
}

export function cambiarPrecio(
  partida: EstadoPartida,
  direccion: 'subir' | 'bajar',
): boolean {
  if (partida.terminado) {
    return false
  }

  const indiceActual = CONFIG.preciosCentavosPorPupusa.indexOf(
    partida.precioCentavosPorPupusa,
  )
  const nuevoIndice = direccion === 'subir' ? indiceActual + 1 : indiceActual - 1
  const nuevoPrecio = CONFIG.preciosCentavosPorPupusa[nuevoIndice]
  if (nuevoPrecio === undefined) {
    return false
  }

  partida.precioCentavosPorPupusa = nuevoPrecio
  return true
}

function crearResumenFinal(
  partida: EstadoPartida,
  motivo: ResumenFinal['motivo'],
): ResumenFinal {
  const gananciaTotalCentavos =
    partida.ingresosTotalesCentavos -
    partida.gastosTotalesCentavos
  const mejorDia = partida.resultados.reduce<ResultadoDia | undefined>(
    (mejor, resultado) =>
      mejor === undefined || resultado.gananciaCentavos > mejor.gananciaCentavos
        ? resultado
        : mejor,
    undefined,
  )

  return {
    dineroInicialCentavos: CONFIG.dineroInicialCentavos,
    ingresosTotalesCentavos: partida.ingresosTotalesCentavos,
    gastosTotalesCentavos: partida.gastosTotalesCentavos,
    gananciaTotalCentavos,
    dineroFinalCentavos: partida.dineroCentavos,
    mejorDia,
    alcanzoMeta:
      motivo !== 'bancarrota' &&
      partida.dineroCentavos >= CONFIG.dineroMetaCentavos,
    motivo,
  }
}

export function abrirPupuseria(partida: EstadoPartida): boolean {
  if (partida.terminado) {
    return false
  }

  if (partida.dineroCentavos < CONFIG.costoGasYLenaCentavos) {
    partida.terminado = true
    partida.resumenFinal = crearResumenFinal(partida, 'bancarrota')
    return true
  }

  const clientesBase =
    CONFIG.clientesBasePorPrecio[partida.precioCentavosPorPupusa]
  const variacion =
    1 -
    CONFIG.variacionAleatoriaDemanda +
    partida.generadorAleatorio.siguiente() *
      CONFIG.variacionAleatoriaDemanda *
      2
  const clientesEstimados = Math.round(
    clientesBase * obtenerMultiplicadorClima(partida.climaDelDia) * variacion,
  )
  const capacidadPorInventario =
    Math.min(
      partida.inventario.masa,
      partida.inventario.queso,
      partida.inventario.frijoles,
    ) * CONFIG.pupusasPorLote
  const pupusasVendidas = Math.min(clientesEstimados, capacidadPorInventario)
  const lotesUtilizados = Math.ceil(pupusasVendidas / CONFIG.pupusasPorLote)
  partida.inventario.masa -= lotesUtilizados
  partida.inventario.queso -= lotesUtilizados
  partida.inventario.frijoles -= lotesUtilizados

  const masaDesperdiciada = partida.inventario.masa
  partida.inventario.masa = 0

  const gastoGasYLena = CONFIG.costoGasYLenaCentavos
  const ingresosCentavos =
    pupusasVendidas * partida.precioCentavosPorPupusa
  const gastosCentavos = partida.gastosDelDiaCentavos + gastoGasYLena
  const gananciaCentavos = ingresosCentavos - gastosCentavos

  partida.dineroCentavos -= gastoGasYLena
  partida.dineroCentavos += ingresosCentavos
  partida.ingresosTotalesCentavos += ingresosCentavos
  partida.gastosTotalesCentavos += gastoGasYLena
  partida.rachaGanancias =
    gananciaCentavos > 0 ? partida.rachaGanancias + 1 : 0

  const resultado: ResultadoDia = {
    dia: partida.diaActual,
    clima: partida.climaDelDia,
    clientesEstimados,
    pupusasVendidas,
    ingresosCentavos,
    gastosCentavos,
    gananciaCentavos,
    masaDesperdiciada,
    mensajeRacha:
      partida.rachaGanancias === 3 ? MENSAJE_RACHA : undefined,
    consejo:
      masaDesperdiciada > 0
        ? 'Compraste más masa de la que utilizaste; calculá mejor cuánto necesitás.'
        : gananciaCentavos > 0
          ? 'El precio elegido dejó un resultado diario positivo.'
          : 'Revisá tus compras y el precio para reducir las pérdidas.',
  }
  partida.resultados.push(resultado)
  partida.historialDinero.push({
    dia: partida.diaActual,
    dineroCentavos: partida.dineroCentavos,
    gananciaCentavos,
  })
  partida.gastosDelDiaCentavos = 0

  if (partida.diaActual === CONFIG.diasTotales) {
    partida.terminado = true
    partida.resumenFinal = crearResumenFinal(
      partida,
      partida.dineroCentavos >= CONFIG.dineroMetaCentavos
        ? 'meta'
        : 'dias_completados',
    )
  } else {
    partida.diaActual += 1
    partida.climaDelDia = sortearClima(partida.generadorAleatorio)
  }

  return true
}
