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

export function getGuestHappiness() {
    let guests = state.guests
    let guestHappiness = [0, 0, 0]
    guests.forEach(guest => {
        if (guest.happiness >= 180) {
            guestHappiness[2] += 1
        } else if (guest.happiness >= 128) {
            guestHappiness[1] += 1
        } else {
            guestHappiness[0] += 1
        }
    })
    for (let i = 0; i < 3; i++) {
        guestHappiness[i] = guestHappiness[i] / guests.length
    }
    return guestHappiness
}