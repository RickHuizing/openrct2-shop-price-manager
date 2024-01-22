import {config} from "./configuration";

export const shopitems = [
    // name base hot cold cost flags
    ['Balloon', 14, 14, 14, 9, 3],
    ['Toy', 30, 30, 30, 25, 1],
    ['Map', 7, 7, 8, 6, 1],
    ['Photo', 30, 30, 30, 0, 5],
    ['Umbrella', 35, 25, 50, 25, 3],
    ['Drink', 12, 20, 10, 12, 8],
    ['Burger', 19, 19, 22, 15, 16],
    ['Chips', 16, 16, 18, 15, 16],
    ['IceCream', 10, 15, 6, 9, 16],
    ['Candyfloss', 9, 9, 6, 8, 16],
    ['EmptyCan', 0, 0, 0, 0, 32],
    ['Rubbish', 0, 0, 0, 0, 32],
    ['EmptyBurgerBox', 0, 0, 0, 0, 32],
    ['Pizza', 21, 21, 25, 16, 16],
    ['Voucher', 0, 0, 0, 0, 0],
    ['Popcorn', 13, 13, 11, 12, 16],
    ['HotDog', 17, 17, 20, 10, 16],
    ['Tentacle', 22, 20, 18, 15, 16],
    ['Hat', 27, 32, 24, 15, 3],
    ['ToffeeApple', 10, 10, 10, 7, 16],
    ['TShirt', 37, 37, 37, 30, 3],
    ['Doughnut', 8, 7, 10, 7, 16],
    ['Coffee', 11, 15, 20, 12, 8],
    ['EmptyCup', 0, 0, 0, 0, 32],
    ['Chicken', 19, 19, 22, 15, 16],
    ['Lemonade', 11, 21, 10, 12, 8],
    ['EmptyBox', 0, 0, 0, 0, 32],
    ['EmptyBottle', 0, 0, 0, 0, 32],
    ['28', 0, 0, 0, 0, 0],
    ['29', 0, 0, 0, 0, 0],
    ['30', 0, 0, 0, 0, 0],
    ['Admission', 0, 0, 0, 0, 0],
    ['Photo2', 30, 30, 30, 0, 5],
    ['Photo3', 30, 30, 30, 0, 5],
    ['Photo4', 30, 30, 30, 0, 5],
    ['Pretzel', 11, 11, 11, 11, 16],
    ['Chocolate', 13, 13, 20, 12, 8],
    ['IcedTea', 10, 20, 10, 11, 8],
    ['FunnelCake', 13, 11, 14, 12, 16],
    ['Sunglasses', 15, 20, 12, 15, 1],
    ['BeefNoodles', 17, 17, 20, 15, 16],
    ['FriedRiceNoodles', 17, 17, 20, 15, 16],
    ['WontonSoup', 13, 13, 15, 15, 16],
    ['MeatballSoup', 14, 14, 16, 15, 16],
    ['FruitJuice', 11, 19, 11, 12, 8],
    ['SoybeanMilk', 10, 14, 10, 12, 8],
    ['Sujeonggwa', 11, 14, 11, 12, 8],
    ['SubSandwich', 19, 19, 17, 15, 16],
    ['Cookie', 8, 8, 8, 7, 16],
    ['EmptyBowlRed', 0, 0, 0, 0, 32],
    ['EmptyDrinkCarton', 0, 0, 0, 0, 32],
    ['EmptyJuiceCup', 0, 0, 0, 0, 32],
    ['RoastSausage', 16, 16, 20, 15, 16],
    ['EmptyBowlBlue', 0, 0, 0, 0, 32],
]

export const SHOP_ITEM_FLAG_IS_SOUVENIR     = 0b00000001
export const SHOP_ITEM_FLAG_IS_RECOLOURABLE = 0b00000010
export const SHOP_ITEM_FLAG_IS_PHOTO        = 0b00000100
export const SHOP_ITEM_FLAG_IS_DRINK        = 0b00001000
export const SHOP_ITEM_FLAG_IS_FOOD        = 0b00010000
export const SHOP_ITEM_FLAG_IS_CONTAINER   = 0b00100000

export function getOptimalPricePoint(flag: number, happiness_ratio: number[]): number {
    let tries = 0
    if (flag & (SHOP_ITEM_FLAG_IS_FOOD | SHOP_ITEM_FLAG_IS_DRINK)) {
        tries = config.getTries('food')
    } else if (flag & (SHOP_ITEM_FLAG_IS_PHOTO)) {
        tries = config.getTries('photo')
    } else if (flag & (SHOP_ITEM_FLAG_IS_SOUVENIR)) {
        tries = config.getTries('souvenir')
    }
    let target = config.getFloat('target')

    let buy_probability_target = 1 - (1 - target) ** (1/tries)
    let price_diff = -1
    let buy_chance = 0
    do {
        price_diff += 1
        buy_chance = 0;
        [0, 1, 2].forEach(value => buy_chance += (1 - (price_diff >> value) / 8) * happiness_ratio[value])
        // console.log(buy_chance, price_diff)
    } while (buy_chance >= buy_probability_target - 0.001)

    return price_diff == 0 ? 0 : price_diff - 1
}

let guestItemsToShopItems: { [guestitem: string]: number } = {
    'tshirt': 20,
    'photo1': 3
}

export function guestItemToShopItem(guestItemName: string): (string | number)[] | undefined {
    let shopItemId = guestItemsToShopItems[guestItemName]
    if (shopItemId != undefined)
        return shopitems[shopItemId]

    let shopItemName = guestItemNameToShopItemName(guestItemName)

    let shopItem: (number | string)[] | undefined = undefined
    shopitems.forEach((shopitem, i) => {
        if (shopitem[0] == shopItemName) {
            shopItem = shopitem
            shopItemId = i
        }
    })

    if (shopItem != undefined && shopItemId != undefined) {
        guestItemsToShopItems[guestItemName] = shopItemId
    } else {
        console.log(`SHOP PRICE MANAGER ERROR: unknown guest item ${guestItemName}`)
    }

    return shopItem
}
function guestItemNameToShopItemName(guestItemName:string) {
    let shopItemName = ''
    let doCapitalize = true
    for (let i = 0; i < guestItemName.length; i++) {
        if (doCapitalize) {
            shopItemName += guestItemName[i].toUpperCase()
            doCapitalize = false
        } else if (guestItemName[i] == '_') {
            doCapitalize = true
        } else {
            shopItemName += guestItemName[i]
        }
    }
    return shopItemName
}