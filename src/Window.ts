import {getGuestHappiness} from "./util";
import {
    getOptimalPricePoint,
    SHOP_ITEM_FLAG_IS_FOOD,
    SHOP_ITEM_FLAG_IS_PHOTO,
    SHOP_ITEM_FLAG_IS_SOUVENIR
} from "./shopitems";

function buildPriceWidgetItems() {
    let guestHappiness = getGuestHappiness()
    let label1GroupItems = ['food', 'souvenir', 'photo']
    let label1GroupVars = [
        getOptimalPricePoint(SHOP_ITEM_FLAG_IS_FOOD, guestHappiness),
        getOptimalPricePoint(SHOP_ITEM_FLAG_IS_SOUVENIR, guestHappiness),
        getOptimalPricePoint(SHOP_ITEM_FLAG_IS_PHOTO, guestHappiness)]
    return label1GroupItems.map((item, index) => [item, String(label1GroupVars[index] / 10)])
}

function buildHappinessWidgetItems() {
    let guestHappiness = getGuestHappiness()
    let label2GroupItems = ['< 128', '128 - 180', '>= 180']
    return label2GroupItems.map((item, index) => [item, (guestHappiness[index] * 100).toFixed(1)])
}

function buildBoughtWidgetItems() {
    let guests = map.getAllEntities('guest')
    let no_guests = guests.length

    // color 0 is no item
    let balloons = 0
    let hats = 0
    let umbrellas = 0
    let tshirts = 0
    guests.forEach(guest => {
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

function buildWidgets() {


    let padding = 5
    let label1height = 50
    let y = 20
    let label1listview: ListViewDesc = {
        name: 'price',
        type: "listview",
        x: 4,
        y: y,
        width: 200,
        height: label1height,
        scrollbars: 'none',
        isStriped: true,
        showColumnHeaders: true,
        columns: [
            {canSort: false, header: 'item type', width: 75},
            {canSort: false, header: 'price over value', width: 75}],
        items: buildPriceWidgetItems(),
        canSelect: false
    }
    y += padding + label1height

    let label2height = 50
    let label2listview: ListViewDesc = {
        name: 'happiness',
        type: "listview",
        x: 4,
        y: y,
        width: 200,
        height: label2height,
        scrollbars: 'none',
        isStriped: true,
        showColumnHeaders: true,
        columns: [
            {canSort: false, header: 'happiness', width: 75},
            {canSort: false, header: '% of guests', width: 75}],
        items: buildHappinessWidgetItems(),
        canSelect: false
    }
    y += padding + label1height


    let label3height = 62
    let label3listview: ListViewDesc = {
        name: 'bought',
        type: "listview",
        x: 4,
        y: y,
        width: 200,
        height: label3height,
        scrollbars: 'none',
        isStriped: true,
        showColumnHeaders: true,
        columns: [
            {canSort: false, header: 'item', width: 75},
            {canSort: false, header: '% of guests', width: 75}],
        items: buildBoughtWidgetItems(),
        canSelect: false
    }

    return [[label1listview, label2listview, label3listview], label1height + label2height + label3height + 3 * padding]
}

let updates = 0

export function buildWindow() {
    if (typeof ui !== "undefined") {
        let window = ui.getWindow("Shop Price Manager")
        if (window != null) {
            window.bringToFront()
        } else {
            let a = buildWidgets()
            let widgets = a[0] as ListViewDesc[]
            let height = a[1] as number
            ui.openWindow({
                classification: "Shop Price Manager",
                minWidth: 100,
                minHeight: 100,
                maxWidth: 1000,
                maxHeight: 1000,
                width: 225,
                height: 24 + height,
                title: "Shop Price Manager",
                widgets: widgets,
                onUpdate: () => {
                    window = ui.getWindow("Shop Price Manager")
                    if (window == null) return

                    if (updates++ < 80) return
                    updates = 0

                    let widget: ListViewWidget = window.findWidget('happiness')
                    widget.items = buildHappinessWidgetItems()

                    widget = window.findWidget('bought')
                    widget.items = buildBoughtWidgetItems()

                    widget = window.findWidget('price')
                    widget.items = buildPriceWidgetItems()

                }
            })
        }
    }
}