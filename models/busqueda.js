import fs from 'node:fs'

import axios from 'axios'

let historial = []
const dbPath = './db/database.json'

const getParamsMapbox = () => {
  const params = {
    access_token: process.env.MAPBOX_KEY,
    limit: 5,
    language: 'es',
  }
  return params
}

const getWeatherParams = (lat, lon) => {
  return {
    lat,
    lon,
    appid: process.env.OPENWEATHER_KEY,
    units: 'metric',
    lang: 'es',
  }
}

const ciudad = async (lugar = '') => {
  try {
    const instance = axios.create({
      baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
      params: getParamsMapbox(),
    })

    const resp = await instance.get()

    return resp.data.features.map((lugar) => ({
      id: lugar.id,
      nombre: lugar.place_name,
      lng: lugar.center[0],
      lat: lugar.center[1],
    }))
  } catch (error) {
    console.log(error)
  }
}

const climaLugar = async (lat, lon) => {
  try {
    // Instance axios
    const instance = axios.create({
      baseURL: 'https://api.openweathermap.org/data/2.5/weather',
      params: getWeatherParams(lat, lon),
    })

    // Respuesta en la data resp.data
    const resp = await instance.get()

    const { weather, main } = resp.data

    return {
      desc: weather[0].description,
      temp: main.temp,
      max: main.temp_max,
      min: main.temp_min,
    }

    // desc: '', min: , max, temp
  } catch (error) {
    console.log(error)
  }
}

const guardarDB = () => {
  const payload = {
    historial,
  }

  fs.writeFileSync(dbPath, JSON.stringify(payload))
}

const agregarHistorial = (lugar = '') => {
  if (historial.includes(lugar.toLocaleLowerCase())) return

  historial = historial.splice(0, 5)

  historial.unshift(lugar.toLocaleLowerCase())

  guardarDB()
}

const leerDB = () => {
  if (!fs.existsSync(dbPath)) return

  const info = fs.readFileSync(dbPath, { encoding: 'utf-8' })

  const data = JSON.parse(info)

  historial = [...data.historial]
}

leerDB()

const historialCapitalizado = () => {
  const newHistorial = historial.map((lugar) => {
    let palabras = lugar.split(' ')
    palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1))
    return palabras.join(' ')
  })
  return newHistorial
}

export { ciudad, climaLugar, agregarHistorial, historial, historialCapitalizado }
