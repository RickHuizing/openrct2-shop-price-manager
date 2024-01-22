import {state} from "../state";
import {SHOP_ITEM_FLAG_IS_SOUVENIR, shopitems} from "../shopitems";
import {uiShared} from "./uiShared";

export function buildItemWidgets() {
    let headerTooltip = "sorting resets on update, but works when paused. Hope the pre-sort is satisfactory:)"
    let itemWidget: ListViewDesc = {
        type: "listview",
        name: 'itemWidget',
        x: 4,
        y: uiShared.getTopY(),
        width: 300,
        height: 200,
        scrollbars: "vertical",
        isStriped: true,
        showColumnHeaders: true,
        columns: [
            {canSort: true, header: 'item', width: 75, headerTooltip: headerTooltip},
            {canSort: true, header: 'value', width: 50, headerTooltip: headerTooltip},
            {canSort: true, header: 'price', width: 50, headerTooltip: headerTooltip},
            {canSort: true, header: 'cost', width: 50, headerTooltip: headerTooltip},
            {canSort: true, header: 'profit', width: 50, headerTooltip: headerTooltip},
        ],
        canSelect: false
    }
    return [itemWidget]
}

export function buildItemWidgetRows() {
    let temp = climate.current.temperature
    let tempIndex = temp >= 21 ? 2 : temp <= 11 ? 3 : 1

    let souvenirRows: string[][] = []
    let foodRows: string[][] = []
    for (let itemsKey in state.shopItemPrices) {
        let shopitem = shopitems[itemsKey]
        let price = state.shopItemPrices[itemsKey]
        let cost = shopitem[4] as number
        let values = [shopitem[0]].concat(
            [shopitem[tempIndex], price, cost, price - cost]
                .map(n => (n as number) / 10)
        ).map(v => String(v))

        if (SHOP_ITEM_FLAG_IS_SOUVENIR & shopitem[5] as number)
            souvenirRows.push(values)
        else foodRows.push(values)
    }
    let sorter = (i1: string[], i2: string[]) => parseFloat(i2[4]) - parseFloat(i1[4])
    souvenirRows.sort(sorter)
    foodRows.sort(sorter)
    return souvenirRows.concat(foodRows)
}