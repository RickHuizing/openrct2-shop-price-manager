import {config} from "../configuration";
import {state} from "../state";
import {
    buildBoughtWidgetRows82,
    buildHappinessWidgetRows,
    buildPriceWidgetRows,
    buildStatWidgets
} from "./statWidgets";
import {buildConfigWidgets} from "./configWidgets";
import {buildItemWidgetRows, buildItemWidgets} from "./itemWidgets";
import {
    uiShared
} from "./uiShared";

export function buildWindow() {
    if (typeof ui !== "undefined") {
        let window = ui.getWindow("Shop Price Manager")
        if (window != null) {
            window.bringToFront()
        } else {
            let statWidgets = buildStatWidgets()

            let y = uiShared.getTopY()
            statWidgets.forEach((widget) => {
                widget.y = y
                y += widget.height + uiShared.padding
            })

            let configWidgets = buildConfigWidgets()
            y = uiShared.getTopY()
            configWidgets.forEach((widgetLine) => {
                let x = 4
                let widgetHeight = 0
                widgetLine.forEach((widget) => {
                    widget.y = y
                    widget.x = x
                    x += widget.width
                    widgetHeight = widget.height
                })
                y += widgetHeight + uiShared.padding
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
            if (uiShared.tabsAsColumns) {
                tabs.forEach((tab: WindowTabDesc) => {
                    let widest = 0
                    tab.widgets?.forEach(widget => {
                        let right = widget.x + widget.width
                        if (right > widest) widest = right
                        widget.x += xDelta

                        widget.y -= uiShared.tabIconHeight
                        let bottom = widget.y + widget.height
                        if (bottom > yDelta) yDelta = bottom
                    })
                    xDelta += widest + uiShared.padding

                    widgets = widgets.concat(tab.widgets!)
                })
                tabs = []
                width = xDelta
                y = yDelta + uiShared.padding
            }


            ui.openWindow({
                classification: "Shop Price Manager",
                // minWidth: 100,
                // minHeight: 125,
                width: width,
                height: y,
                title: "Shop Price Manager",
                tabs: tabs,
                widgets: widgets,
                onUpdate: updateUI,
                onTabChange: () => uiShared.updateOnNextTick()
            })
        }
        uiShared.currentShopItemPriceVersion = -1
        uiShared.updateOnNextTick()
    }
}

function updateUI() {
    let window = ui.getWindow("Shop Price Manager")
    window.tabIndex
    if (window == null) return

    if (uiShared.ticksSinceLastUpdate++ < uiShared.ticksPerUpdate) return
    uiShared.ticksSinceLastUpdate = 0

    state.updateGuests()
    state.updateGuestHappiness()

    let y = uiShared.getTopY()

    if (uiShared.tabsAsColumns || window.tabIndex == 0) {
        let vars = ['target', 'food', 'souvenir', 'photo']
        let gets = [config.getFloat, config.getTries, config.getTries, config.getTries]
        vars.forEach((variable, index) => {
            let widget = window.findWidget<SpinnerWidget>(variable + 'Spinner')
            y += widget.height + uiShared.padding

            widget.text = String(gets[index](variable))
        })

        if (!uiShared.tabsAsColumns) window.height = y
    }

    if (uiShared.tabsAsColumns || window.tabIndex == 1) {

        let widget: ListViewWidget = window.findWidget('happiness')
        widget.items = buildHappinessWidgetRows()
        y += widget.height + uiShared.padding

        widget = window.findWidget('bought')
        widget.items = buildBoughtWidgetRows82()
        y += widget.height + uiShared.padding

        widget = window.findWidget('price')
        widget.items = buildPriceWidgetRows()
        y += widget.height + uiShared.padding

        if (!uiShared.tabsAsColumns) window.height = y + uiShared.padding
    }

    if ((uiShared.tabsAsColumns || window.tabIndex == 2) &&
        uiShared.currentShopItemPriceVersion != state.shopItemPriceVersion) {
        uiShared.currentShopItemPriceVersion = state.shopItemPriceVersion
        let widget: ListViewWidget = window.findWidget('itemWidget')
        // accessing columns crashes the game
        // let sortOrder: string[] = []
        // widget.columns.forEach(col=>sortOrder.push(col.sortOrder))
        widget.items = buildItemWidgetRows()
        // widget.columns.forEach((col, i)=>col.sortOrder = sortOrder[i])

        if (!uiShared.tabsAsColumns) {
            widget.y = y
            widget.x = 4

            window.height = y + uiShared.padding + widget.height
            window.width = widget.x + uiShared.padding * 2 + widget.width
        }
    }
}
