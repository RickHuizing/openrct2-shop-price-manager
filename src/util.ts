export function getGuestHappiness() {
    let guests = map.getAllEntities("guest")
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