import {updateShopPrices} from "./startup";

const rctStorage = context.getParkStorage()

// const globalStorage = context.sharedStorage

interface ShopManagerConfig {
    getFloat(key: string): number

    updateFloat(key: string, delta: number): void

    setFloat(key: string, value: number | string): void

    init(): void

    getTries(key: string): number

    setTries(key: string, value: number | string): void

    updateTries(key: string, delta: number): void
}

export function init_config() {
    config.init()
}

function getFloat(key: string): number {
    let value = parseFloat(rctStorage.get<string>(key) ?? '')
    if (isNaN(value)) {
        value = 0.0
        setFloat(key, value)
    }
    return value
}

function setFloat(key: string, value: number) {
    rctStorage.set<string>(key, String(value))
}

function getInt(key: string): number {
    let value = parseInt(rctStorage.get<string>(key) ?? '')
    if (isNaN(value)) {
        value = 0
        setInt(key, value)
    }
    return value
}

function setInt(key: string, value: number) {
    rctStorage.set<string>(key, String(Math.round(value)))
}

export const config: ShopManagerConfig = {

    init(): void {
        let defaultFloats = [['target', 0.9]]
        defaultFloats.forEach(float=> {
            if (!rctStorage.has(float[0] as string)) this.setFloat(float[0] as string, float[1])
        })
        let defaultTries = [['food', 2],['souvenir', 4],['photo', 5]]
        defaultTries.forEach(int=> {
            if (!rctStorage.has(int[0] as string)) this.setTries(int[0] as string, int[1])
        })
        for (let allKey in rctStorage.getAll()) {
            console.log(allKey, rctStorage.getAll()[allKey])
        }
    },
    getFloat(key: string): number {
        return getFloat(key)
    },
    setFloat(key: string, value: number | string): void {
        if (typeof value == 'string') value = parseFloat(value)
        if (isNaN(value)) return
        let converted = (value < 0 ? 0 : value > 1 ? 1 : value).toFixed(4)
        rctStorage.set(key, converted)
        updateShopPrices()
    },
    updateFloat(key: string, delta: number): void {
        this.setFloat(key, this.getFloat(key) + delta)
    },

    getTries(key: string): number {
        let tries = getInt(key + '_tries')
        if (tries <= 0) {
            tries = 1
            this.setTries(key, tries)
        }
        return tries
    },
    setTries(key: string, value: number | string): void {
        if (typeof value == 'string') value = parseInt(value)
        if (isNaN(value)) return
        setInt(key + '_tries', value < 1 ? 1 : value)
    },
    updateTries(key: string, delta: number): void {
        this.setTries(key, this.getTries(key) + delta)
    },

}

