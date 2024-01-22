import {
    getOptimalPricePoint,
    guestItemToShopItem,
    SHOP_ITEM_FLAG_IS_FOOD,
    SHOP_ITEM_FLAG_IS_PHOTO,
    SHOP_ITEM_FLAG_IS_SOUVENIR
} from "../shopitems";
import {state} from "../state";
import {guestsBought} from "../util";
import {uiShared} from "./uiShared";

let firstColumnWidth = 100
let secondColumnWidth = 50

export function buildStatWidgets() {
    let label1height = 50
    let label1listview: ListViewDesc = {
        name: 'price',
        type: "listview",
        x: 4,
        y: 0,
        width: 200,
        height: label1height,
        scrollbars: 'none',
        isStriped: true,
        showColumnHeaders: true,
        columns: [
            {canSort: false, header: 'item type', width: firstColumnWidth},
            {canSort: false, header: 'price over value', width: secondColumnWidth}],
        canSelect: false
    }

    let label2height = 50
    let label2listview: ListViewDesc = {
        name: 'happiness',
        type: "listview",
        x: 4,
        y: 0,
        width: 200,
        height: label2height,
        scrollbars: 'none',
        isStriped: true,
        showColumnHeaders: true,
        columns: [
            {canSort: false, header: 'happiness', width: firstColumnWidth},
            {canSort: false, header: '% of guests', width: secondColumnWidth}],
        canSelect: false
    }


    let label3height = 100 - 2 * uiShared.padding
    let label3listview: ListViewDesc = {
        name: 'bought',
        type: "listview",
        x: 4,
        y: 0,
        width: 200,
        height: label3height,
        scrollbars: 'vertical',
        isStriped: true,
        showColumnHeaders: true,
        columns: [
            {canSort: false, header: 'item', width: firstColumnWidth},
            {canSort: false, header: '% of guests', width: secondColumnWidth}],
        canSelect: false
    }
    return [label1listview, label2listview, label3listview]
}

export function buildPriceWidgetRows() {
    let label1GroupItems = ['food', 'souvenir', 'photo']
    let label1GroupVars = [
        getOptimalPricePoint(SHOP_ITEM_FLAG_IS_FOOD, state.guestHappiness),
        getOptimalPricePoint(SHOP_ITEM_FLAG_IS_SOUVENIR, state.guestHappiness),
        getOptimalPricePoint(SHOP_ITEM_FLAG_IS_PHOTO, state.guestHappiness)]
    return label1GroupItems.map((item, index) => [item, String(label1GroupVars[index] / 10)])
} // for api version 82
export function buildHappinessWidgetRows() {
    let label2GroupItems = ['< 128', '128 - 180', '>= 180']
    return label2GroupItems.map((item, index) => [item, (state.guestHappiness[index] * 100).toFixed(1)])
}

export function buildBoughtWidgetRows82() {

    let buys = guestsBought()
    let no_of_guests = state.guests.length

    let souvenirRows: string[][] = []
    let photoRows: string[][] = []

    for (const itemName in buys) {
        let shopitem = guestItemToShopItem(itemName)
        if (shopitem == undefined) continue
        let n = buys[itemName]
        if (n > 0) {
            if (SHOP_ITEM_FLAG_IS_SOUVENIR & shopitem[5] as number) {
                let widgetRow = [String(shopitem[0]), (n / no_of_guests * 100).toFixed(1)]
                if (SHOP_ITEM_FLAG_IS_PHOTO & shopitem[5] as number) {
                    photoRows.push(widgetRow)
                } else souvenirRows.push(widgetRow)
            }
        }
    }
    souvenirRows.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
    let rows = souvenirRows.concat(photoRows)
    if (rows.length == 0) rows = [['no souvenirs sold', '---']]
    return rows
}

function buildBoughtWidgetItems() {
    let no_guests = state.guests.length

    // color 0 is no item
    let balloons = 0
    let hats = 0
    let umbrellas = 0
    let tshirts = 0
    state.guests.forEach(guest => {
        balloons += guest.balloonColour != 0 ? 1 : 0
        hats += guest.hatColour != 0 ? 1 : 0
        umbrellas += guest.umbrellaColour != 0 ? 1 : 0
        // color 2 is white
        tshirts += guest.tshirtColour == 2 ? 1 : 0
    })

    let label3GroupItems = ['balloons', 'hats', 'umbrellas', 'tshirts']
    let label3GroupValues = [balloons, hats, umbrellas, tshirts]
    return label3GroupItems.map((item, index) => [item, (label3GroupValues[index] / no_guests * 100).toFixed(1)])
}