import { describe, expect, it } from 'vitest'
import {
  CONFIG,
  abrirPupuseria,
  cambiarPrecio,
  comprarIngrediente,
  crearPartida,
} from '../src/logica.ts'

describe('lógica de Mi Pupusería', () => {
  it('arma el estado inicial con el dinero, inventario y precio correctos', () => {
    const partida = crearPartida(12)

    expect(partida.diaActual).toBe(1)
    expect(partida.dineroCentavos).toBe(CONFIG.dineroInicialCentavos)
    expect(partida.inventario).toEqual({ masa: 0, queso: 0, frijoles: 0 })
    expect(partida.precioCentavosPorPupusa).toBe(75)
    expect(['lluvia', 'normal', 'feria']).toContain(partida.climaDelDia)
    expect(partida.resultados).toEqual([])
    expect(partida.terminado).toBe(false)
  })

  it('compra un ingrediente cuando hay dinero y rechaza la compra cuando no alcanza', () => {
    const partida = crearPartida(12)

    expect(comprarIngrediente(partida, 'masa')).toBe(true)
    expect(partida.inventario.masa).toBe(1)
    expect(partida.dineroCentavos).toBe(
      CONFIG.dineroInicialCentavos - CONFIG.costoLoteMasaCentavos,
    )
    expect(partida.gastosDelDiaCentavos).toBe(CONFIG.costoLoteMasaCentavos)

    partida.dineroCentavos = 0
    expect(comprarIngrediente(partida, 'queso')).toBe(false)
    expect(partida.inventario.queso).toBe(0)
  })

  it('sube y baja el precio y rechaza valores fuera de las opciones permitidas', () => {
    const partida = crearPartida(12)

    expect(cambiarPrecio(partida, 'subir')).toBe(true)
    expect(partida.precioCentavosPorPupusa).toBe(100)
    expect(cambiarPrecio(partida, 'subir')).toBe(false)
    expect(partida.precioCentavosPorPupusa).toBe(100)
    expect(cambiarPrecio(partida, 'bajar')).toBe(true)
    expect(partida.precioCentavosPorPupusa).toBe(75)
  })

  it('abre el negocio, vende según el inventario y registra ingresos y gastos', () => {
    const partida = crearPartida(0)
    partida.climaDelDia = 'normal'
    partida.precioCentavosPorPupusa = 100

    for (const ingrediente of ['masa', 'queso', 'frijoles'] as const) {
      expect(comprarIngrediente(partida, ingrediente)).toBe(true)
      expect(comprarIngrediente(partida, ingrediente)).toBe(true)
    }

    expect(abrirPupuseria(partida)).toBe(true)
    expect(partida.resultados).toHaveLength(1)
    expect(partida.resultados[0].pupusasVendidas).toBe(20)
    expect(partida.resultados[0].ingresosCentavos).toBe(2000)
    expect(partida.resultados[0].gastosCentavos).toBe(1300)
    expect(partida.resultados[0].gananciaCentavos).toBe(700)
    expect(partida.inventario).toEqual({ masa: 0, queso: 0, frijoles: 0 })
    expect(partida.diaActual).toBe(2)
  })

  it('no permite comprar ni cambiar el precio después de terminar la partida', () => {
    const partida = crearPartida(12)
    partida.terminado = true

    expect(comprarIngrediente(partida, 'masa')).toBe(false)
    expect(cambiarPrecio(partida, 'subir')).toBe(false)
    expect(abrirPupuseria(partida)).toBe(false)
  })

  it('termina en bancarrota si no hay dinero suficiente para gas y leña', () => {
    const partida = crearPartida(12)
    partida.dineroCentavos = CONFIG.costoGasYLenaCentavos - 1

    expect(abrirPupuseria(partida)).toBe(true)
    expect(partida.terminado).toBe(true)
    expect(partida.resumenFinal?.motivo).toBe('bancarrota')
    expect(partida.resumenFinal?.alcanzoMeta).toBe(false)
    expect(abrirPupuseria(partida)).toBe(false)
  })

  it('termina el día diez con derrota si no alcanza la meta de dinero', () => {
    const partida = crearPartida(12)

    for (let dia = 0; dia < CONFIG.diasTotales; dia += 1) {
      expect(abrirPupuseria(partida)).toBe(true)
    }

    expect(partida.terminado).toBe(true)
    expect(partida.resultados).toHaveLength(CONFIG.diasTotales)
    expect(partida.dineroCentavos).toBe(0)
    expect(partida.resumenFinal?.motivo).toBe('dias_completados')
    expect(partida.resumenFinal?.alcanzoMeta).toBe(false)
  })

  it('recorre la partida completa y alcanza la meta de setenta dólares', () => {
    const partida = crearPartida(0)

    expect(cambiarPrecio(partida, 'subir')).toBe(true)

    for (let dia = 0; dia < CONFIG.diasTotales; dia += 1) {
      for (const ingrediente of ['masa', 'queso', 'frijoles'] as const) {
        expect(comprarIngrediente(partida, ingrediente)).toBe(true)
        expect(comprarIngrediente(partida, ingrediente)).toBe(true)
      }
      expect(abrirPupuseria(partida)).toBe(true)
    }

    expect(partida.terminado).toBe(true)
    expect(partida.resultados).toHaveLength(CONFIG.diasTotales)
    expect(partida.resumenFinal?.dineroFinalCentavos).toBeGreaterThanOrEqual(
      CONFIG.dineroMetaCentavos,
    )
    expect(partida.resumenFinal?.dineroFinalCentavos).toBe(9800)
    expect(partida.resumenFinal?.alcanzoMeta).toBe(true)
    expect(partida.resumenFinal?.motivo).toBe('meta')
    expect(comprarIngrediente(partida, 'masa')).toBe(false)
  })
})
