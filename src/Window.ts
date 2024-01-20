import {getGuestHappiness} from "./util";
import {
    getOptimalPricePoint,
    SHOP_ITEM_FLAG_IS_FOOD,
    SHOP_ITEM_FLAG_IS_PHOTO,
    SHOP_ITEM_FLAG_IS_SOUVENIR,
    shopitems
} from "./shopitems";
import {config} from "./configuration";
import {state} from "./state";
import {updateShopPrices} from "./startup";

function buildStatWidgets() {
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
            {canSort: false, header: 'item type', width: 75},
            {canSort: false, header: 'price over value', width: 75}],
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
            {canSort: false, header: 'happiness', width: 75},
            {canSort: false, header: '% of guests', width: 75}],
        canSelect: false
    }


    let label3height = 62
    let label3listview: ListViewDesc = {
        name: 'bought',
        type: "listview",
        x: 4,
        y: 0,
        width: 200,
        height: label3height,
        scrollbars: 'none',
        isStriped: true,
        showColumnHeaders: true,
        columns: [
            {canSort: false, header: 'item', width: 75},
            {canSort: false, header: '% of guests', width: 75}],
        canSelect: false
    }
    return [label1listview, label2listview, label3listview]
}


function buildConfigWidgets() {
    let spinnerWidth = 100
    let labelWidth = 100

    let height = 12
    let vars = ['target', 'food', 'souvenir', 'photo']
    let ranges = [[0, 1], [0, 100], [0, 100], [0, 100]]

    let y = 0
    return vars.map((variable, index) => {

        let range = ranges[index]
        let label: LabelDesc = {
            type: "label",
            name: variable + "Label",
            text: variable + " [" + range[0] + " , " + range[1] + ']',
            x: 4,
            y: y,
            width: labelWidth,
            height: height
        }
        y += height + padding

        let spinner: SpinnerDesc = {
            type: "spinner",
            name: variable + 'Spinner',
            text: '----',
            x: 4,
            y: y,
            width: spinnerWidth,
            height: height,
            onIncrement: () => {
                if (index == 0) config.updateFloat(variable, 0.01)
                else config.updateTries(variable, 1)
                updates = update_skips
            },
            onDecrement: () => {
                if (index == 0) config.updateFloat(variable, -0.01)
                else config.updateTries(variable, -1)
                updates = update_skips
            },
            onClick: () => {
                ui.showTextInput({
                    title: 'title',
                    description: 'description',
                    initialValue: String(index == 0 ? config.getFloat(variable) : config.getTries('variable')),
                    maxLength: 10,
                    callback: (value: string) => {
                        index == 0 ? config.setFloat(variable, value) : config.setTries(variable, value)
                        updates = update_skips
                    }
                })
            }
        }
        y += height + padding
        return [label, spinner]
    })
}

function buildItemWidgets() {

    let itemWidget: ListViewDesc = {
        type: "listview",
        name: 'itemWidget',
        x: 4,
        y: 20 + tabIconHeight + padding,
        width: 300,
        height: 200,
        scrollbars: "vertical",
        isStriped: true,
        showColumnHeaders: true,
        columns: [
            {canSort: true, header: 'item', width: 75},
            {canSort: true, header: 'value', width: 50},
            {canSort: true, header: 'price', width: 50},
            {canSort: true, header: 'cost', width: 50},
            {canSort: true, header: 'profit', width: 50},
        ],
        canSelect: false
    }
    return [itemWidget]
}

let updates = 0
const update_skips = 40

const tabIconHeight = 28
const padding = 5

let tabsAsColumns = true

export function buildWindow() {
    if (typeof ui !== "undefined") {
        let window = ui.getWindow("Shop Price Manager")
        if (window != null) {
            window.bringToFront()
        } else {

            let statWidgets = buildStatWidgets()

            let y = 15 + tabIconHeight + padding
            statWidgets.forEach((widget) => {
                widget.y = y
                y += widget.height + padding
            })

            let configWidgets = buildConfigWidgets()
            y = 15 + tabIconHeight + padding
            configWidgets.forEach((widgetLine) => {
                let x = 4
                let widgetHeight = 0
                widgetLine.forEach((widget) => {
                    widget.y = y
                    widget.x = x
                    x += widget.width
                    widgetHeight = widget.height
                })
                y += widgetHeight + padding
            })

            let tabs: WindowTabDesc[] = [
                {
                    image: "simulate",
                    widgets: configWidgets.reduce((widgets, next) => widgets.concat(next))
                },
                {
                    image: "search" as IconName,
                    widgets: statWidgets
                },
                {
                    image: 3,
                    widgets: buildItemWidgets()
                }
            ]

            let width = 225

            let xDelta = 0
            let yDelta = 0
            let widgets: WidgetDesc[] = []
            if (tabsAsColumns) {
                tabs.forEach((tab: WindowTabDesc) => {
                    let widest = 0
                    tab.widgets?.forEach(widget => {
                        let right = widget.x + widget.width
                        if (right > widest) widest = right
                        widget.x += xDelta

                        widget.y -= tabIconHeight
                        let bottom = widget.y + widget.height
                        if (bottom > yDelta) yDelta = bottom
                    })
                    xDelta += widest + padding

                    widgets = widgets.concat(tab.widgets!)
                })
                tabs = []
                width = xDelta
                y = yDelta + padding
            }


            ui.openWindow({
                classification: "Shop Price Manager",
                minWidth: 100,
                minHeight: 125,
                width: width,
                height: y,
                title: "Shop Price Manager",
                tabs: tabs,
                widgets: widgets,
                onUpdate: () => {
                    window = ui.getWindow("Shop Price Manager")
                    window.tabIndex
                    if (window == null) return

                    if (updates++ < update_skips) return
                    updates = 0

                    guestHappiness = getGuestHappiness()

                    let y = 20 + tabIconHeight + padding

                    if (tabsAsColumns || window.tabIndex == 0) {
                        let vars = ['target', 'food', 'souvenir', 'photo']
                        let gets = [config.getFloat, config.getTries, config.getTries, config.getTries]
                        vars.forEach((variable, index) => {
                            let widget = window.findWidget<SpinnerWidget>(variable + 'Spinner')
                            y += widget.height + padding

                            widget.text = String(gets[index](variable))
                        })

                        if (!tabsAsColumns) window.height = y
                    }

                    if (tabsAsColumns || window.tabIndex == 1) {

                        let widget: ListViewWidget = window.findWidget('happiness')
                        widget.items = buildHappinessWidgetItems()
                        y += widget.height + padding

                        widget = window.findWidget('bought')
                        widget.items = buildBoughtWidgetItems()
                        y += widget.height + padding

                        widget = window.findWidget('price')
                        widget.items = buildPriceWidgetItems()
                        y += widget.height + padding

                        if (!tabsAsColumns) window.height = y + padding
                    }

                    if (tabsAsColumns || window.tabIndex == 2) {
                        let widget: ListViewWidget = window.findWidget('itemWidget')
                        widget.items = buildItemWidgetItems()

                        if (!tabsAsColumns) {
                            widget.y = y
                            widget.x = 4

                            window.height = y + padding + widget.height
                            window.width = widget.x + padding * 2 + widget.width
                        }
                    }
                },
                onTabChange: () => updates = update_skips
            })
        }
        updates = update_skips
    }
}

let guestHappiness = getGuestHappiness()

function buildPriceWidgetItems() {
    let label1GroupItems = ['food', 'souvenir', 'photo']
    let label1GroupVars = [
        getOptimalPricePoint(SHOP_ITEM_FLAG_IS_FOOD, guestHappiness),
        getOptimalPricePoint(SHOP_ITEM_FLAG_IS_SOUVENIR, guestHappiness),
        getOptimalPricePoint(SHOP_ITEM_FLAG_IS_PHOTO, guestHappiness)]
    return label1GroupItems.map((item, index) => [item, String(label1GroupVars[index] / 10)])
}

function buildHappinessWidgetItems() {
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

function buildItemWidgetItems() {
    updateShopPrices()
    let temp = climate.current.temperature
    let tempIndex = temp >= 21 ? 2 : temp <= 11 ? 3 : 1

    let items: (string | number)[][] = []
    for (let itemsKey in state.items) {
        let shopitem = shopitems[itemsKey]
        let price = state.items[itemsKey]
        let cost = shopitem[4] as number
        let values = [shopitem[0]].concat(
            [shopitem[tempIndex], price, cost, price - cost]
                .map(n => (n as number) / 10)
        )
        items = items.concat([values])
    }
    return items.map(row => row.map(item => String(item)))
}