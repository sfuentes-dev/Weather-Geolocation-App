import * as dotenv from 'dotenv'
import { inquirerMenu, leerInput, pausa, listarLugares } from './helpers/inquirer.js'
import {
  ciudad,
  climaLugar,
  agregarHistorial,
  historial,
  historialCapitalizado,
} from './models/busqueda.js'

dotenv.config()

const main = async () => {
  // const busquedas = new Busquedas()

  let opt

  do {
    opt = await inquirerMenu()

    switch (opt) {
      case 1:
        // Mostrar mensaje
        const termino = await leerInput('Lugar: ')

        // Buscar los lugares
        const lugares = await ciudad(termino)

        // Seleccionar el lugar
        const id = await listarLugares(lugares)
        if (id === '0') continue

        const lugarSelec = lugares.find((l) => l.id === id)
        agregarHistorial(lugarSelec.nombre)

        const { desc, temp, max, min } = await climaLugar(lugarSelec.lat, lugarSelec.lng)

        console.log()
        console.log('\nInformacion de la ciudad\n'.green)
        console.log('Ciudad:', lugarSelec.nombre.green)
        console.log('Lat:', lugarSelec.lat)
        console.log('Lng:', lugarSelec.lng)
        console.log('Temperatura:', temp)
        console.log('Minimia:', min)
        console.log('Maxima:', max)
        console.log('El clima se ve:', desc.green)
        break

      case 2:
        historialCapitalizado().forEach((lugar, i) => {
          const idx = `${i + 1}.`.green
          console.log(`${idx} ${lugar}`)
        })
        break
    }

    if (opt !== 0) await pausa()
  } while (opt !== 0)
}

main()
