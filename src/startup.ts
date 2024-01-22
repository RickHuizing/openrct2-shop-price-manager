import {
    getOptimalPricePoint,
    SHOP_ITEM_FLAG_IS_DRINK,
    SHOP_ITEM_FLAG_IS_FOOD,
    SHOP_ITEM_FLAG_IS_PHOTO,
    SHOP_ITEM_FLAG_IS_SOUVENIR,
    shopitems
} from './shopitems'
import {getGuestHappiness} from "./util";
import {buildWindow} from "./ui/Window";
import {init_config} from "./configuration"
import {DEBUG, state} from "./state";


// force update on startup to initialize state.items.
let forceUpdatePrices = true

export function updateShopPrices() {
    let guestHappiness = getGuestHappiness()
    if (DEBUG) console.log(guestHappiness)

    let foodPriceIncrease = getOptimalPricePoint(SHOP_ITEM_FLAG_IS_FOOD, guestHappiness)
    let photoPriceIncrease = getOptimalPricePoint(SHOP_ITEM_FLAG_IS_PHOTO, guestHappiness)
    let souvenirPriceIncrease = getOptimalPricePoint(SHOP_ITEM_FLAG_IS_SOUVENIR, guestHappiness)

    let temp = climate.current.temperature
    let tempIndex = temp >= 21 ? 2 : temp <= 11 ? 3 : 1

    let pricesUpdated = false

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
            if (DEBUG) console.log('updating price for ' + ride.name + ' from ' + oldPrice + ' to ' + newPrice)
            pricesUpdated = true

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
        return newPrice
    }

    let rides = map.rides
    let items: { [id: number]: number } = {}
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
                items[itemPrimary] = updateRidePrice(ride, shopitem, currentValue as number, true)
            }

            if (itemSecondary != 255) {
                let shopitem = shopitems[itemSecondary]
                let currentValue = shopitem[tempIndex]
                let currentPrice = ride.price[1]
                log_shopitem(ride, shopitem, currentValue, currentPrice);
                items[itemSecondary] = updateRidePrice(ride, shopitem, currentValue as number, false)
            }
        }

        if (ride.classification == 'ride' && ride.price.length == 2) {
            let shopitem = shopitems[3] // photo
            let currentValue = shopitem[tempIndex]
            let currentPrice = ride.price[1]

            log_shopitem(ride, shopitem, currentValue, currentPrice)
            items[3] = updateRidePrice(ride, shopitem, currentValue as number, false)
        }
    })
    if (pricesUpdated || forceUpdatePrices) {
        forceUpdatePrices = false
        state.shopItemPrices = items
        state.shopItemPriceVersion++
    }
    if (DEBUG) console.log()
}

function log_shopitem(ride: Ride, shopitem: (string | number)[], currentValue: string | number, currentPrice: number) {
    if (!DEBUG) return

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
    init_config()

    // Register a menu item under the map icon:
    if (typeof ui !== "undefined") {
        ui.registerMenuItem('Shop Price Manager', () => onClickMenuItem());
    }

    context.subscribe('interval.day', () => {
        if (context.mode == 'normal') updateShopPrices()
    })

    if (context.mode == 'normal')
        updateShopPrices()
}