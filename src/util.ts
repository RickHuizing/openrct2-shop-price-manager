import {state} from "./state";

export function guestsBought(): { [p: string]: number } | undefined {
    let guests = state.guests
    let boughtItems: { [itemName: string]: number } = {}
    if (guests.length > 0 && guests[0].items == undefined) {
        return undefined
    }
    guests.forEach(guest => guest.items.forEach((item) => {
        if (boughtItems[item.type] == undefined) {
            boughtItems[item.type] = 1
        } else {
            boughtItems[item.type] += 1
        }
    }))

    return boughtItems
}