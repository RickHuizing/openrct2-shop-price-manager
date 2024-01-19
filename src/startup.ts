import {
    getOptimalPricePoint,
    SHOP_ITEM_FLAG_IS_DRINK,
    SHOP_ITEM_FLAG_IS_FOOD,
    SHOP_ITEM_FLAG_IS_PHOTO,
    SHOP_ITEM_FLAG_IS_SOUVENIR,
    shopitems
} from './shopitems'
import {getGuestHappiness} from "./util";
import {buildWindow} from "./Window";

const doLog = false


function updateShopPrices() {
    let guestHappiness = getGuestHappiness()
    if (doLog) console.log(guestHappiness)

    let foodPriceIncrease = getOptimalPricePoint(SHOP_ITEM_FLAG_IS_FOOD, guestHappiness)
    let photoPriceIncrease = getOptimalPricePoint(SHOP_ITEM_FLAG_IS_PHOTO, guestHappiness)
    let souvenirPriceIncrease = getOptimalPricePoint(SHOP_ITEM_FLAG_IS_SOUVENIR, guestHappiness)

    let temp = climate.current.temperature
    let tempIndex = temp >= 21 ? 2 : temp <= 11 ? 3 : 1

    function updateRidePrice(ride: Ride, shopitem: (string | number)[], currentValue: number, isPrimaryPrice: boolean) {
        let newPricePoint = 0
        if ((shopitem[5] as number) & (SHOP_ITEM_FLAG_IS_FOOD | SHOP_ITEM_FLAG_IS_DRINK)) {
            newPricePoint = foodPriceIncrease
        } else if ((shopitem[5] as number) & (SHOP_ITEM_FLAG_IS_PHOTO)) {
            newPricePoint = photoPriceIncrease
        } else if ((shopitem[5] as number) & (SHOP_ITEM_FLAG_IS_SOUVENIR)) {
            newPricePoint = souvenirPriceIncrease
        }

        let oldPrice = ride.price[isPrimaryPrice ? 0 : 1]
        let newPrice = currentValue + newPricePoint
        if (oldPrice != newPrice) {
            console.log('updating price for ' + ride.name + ' from ' + oldPrice + ' to ' + newPrice)

            let result: GameActionResult | undefined = undefined
            context.executeAction(
                'ridesetprice',
                {ride: ride.id, price: currentValue + newPricePoint, isPrimaryPrice: isPrimaryPrice},
                r => result = r)

            if (result === undefined) {
                // do nothing
            } else {
                if (result['error'] !== undefined && result['error'] != 0) {
                    console.log(result)
                }
            }
        }
    }

    let rides = map.rides

    rides.forEach((ride) => {
        if ((ride.classification == 'stall') || ride.object.name == 'Information Kiosk') {
            let rideObject = ride.object
            let itemPrimary = rideObject.shopItem
            let itemSecondary = rideObject.shopItemSecondary

            if (itemPrimary != 255) {
                let shopitem = shopitems[itemPrimary]
                let currentValue = shopitem[tempIndex]
                let currentPrice = ride.price[0]
                log_shopitem(ride, shopitem, currentValue, currentPrice);
                updateRidePrice(ride, shopitem, currentValue as number, true)
            }

            if (itemSecondary != 255) {
                let shopitem = shopitems[itemSecondary]
                let currentValue = shopitem[tempIndex]
                let currentPrice = ride.price[1]
                log_shopitem(ride, shopitem, currentValue, currentPrice);
                updateRidePrice(ride, shopitem, currentValue as number, false)

            }
        }

        if (ride.classification == 'ride' && ride.price.length == 2) {
            let shopitem = shopitems[3]
            let currentValue = shopitem[tempIndex]
            let currentPrice = ride.price[1]
            log_shopitem(ride, shopitem, currentValue, currentPrice)
            updateRidePrice(ride, shopitem, currentValue as number, false)
        }
    })

    if (doLog) console.log()
}

function log_shopitem(ride: Ride, shopitem: (string | number)[], currentValue: string | number, currentPrice: number) {
    if (!doLog) return

    console.log(ride.id + ': ' + shopitem[0] + ' current value: ' + currentValue + ' current price: ' + currentPrice)
    if ((shopitem[5] as number) & (SHOP_ITEM_FLAG_IS_FOOD | SHOP_ITEM_FLAG_IS_DRINK)) {
        console.log('food or drink')
    } else if ((shopitem[5] as number) & (SHOP_ITEM_FLAG_IS_PHOTO)) {
        console.log('photo')
    } else if ((shopitem[5] as number) & (SHOP_ITEM_FLAG_IS_SOUVENIR)) {
        console.log('souvenir')
    }
}

function onClickMenuItem() {
    if (typeof ui === "undefined") {
        return
    }

    buildWindow();

}

export function startup() {
    // Register a menu item under the map icon:
    if (typeof ui !== "undefined") {
        ui.registerMenuItem("Shop Price Manager", () => onClickMenuItem());
    }

    context.subscribe('interval.day', () => updateShopPrices())
}