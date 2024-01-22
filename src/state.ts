import {getGuestHappiness} from "./util";

export const DEBUG = false

interface State {
    shopItemPrices: { [id: number]: number }
    shopItemPriceVersion: number
    guests: Guest[]

    updateGuests(): void

    guestHappiness: number[]

    updateGuestHappiness(): void
}

export let state: State = {
    shopItemPrices: {},
    shopItemPriceVersion: 0,
    guests: [],
    updateGuests() {
        this.guests = map.getAllEntities('guest')
    },
    guestHappiness: [],
    updateGuestHappiness() {
        this.guestHappiness = getGuestHappiness()
    }
}