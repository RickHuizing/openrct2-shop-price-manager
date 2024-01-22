import {state} from "./state";

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

export function guestsBought(): { [itemName: string]: number } {
    let guests = state.guests
    let boughtItems: { [itemName: string]: number } = {}

    guests.forEach(guest => guest.items.forEach((item) => {
        if (boughtItems[item.type] == undefined) {
            boughtItems[item.type] = 1
        } else {
            boughtItems[item.type] += 1
        }
    }))

    return boughtItems
}