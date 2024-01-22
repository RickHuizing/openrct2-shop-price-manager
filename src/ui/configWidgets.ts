import {config} from "../configuration";
import {uiShared} from "./uiShared";
import {updateShopPrices} from "../manageShopPrices";

export function buildConfigWidgets() {
    let spinnerWidth = 100
    let labelWidth = 100

    let height = 12

    let y = 0

    let toggleManagePricesLabel: LabelDesc = {
        type: "label",
        name: "enable price management",
        text: "enable price management",
        textAlign: 'left',
        width: labelWidth,
        height: height,
        x: 4,
        y: y
    }
    let toggleManagePricesButton = createToggleManagePricesButton()
    toggleManagePricesButton.x = 4
    toggleManagePricesButton.y = y
    let toggleManagePricesRow = [toggleManagePricesLabel, toggleManagePricesButton]

    let vars = ['target', 'food', 'souvenir', 'photo']
    let ranges = [[0, 1], [0, 100], [0, 100], [0, 100]]
    let spinnerWidgetRows = vars.map((variable, index) => {

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
        y += height + uiShared.padding

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
                updateShopPrices()
                uiShared.updateOnNextTick()
            },
            onDecrement: () => {
                if (index == 0) config.updateFloat(variable, -0.01)
                else config.updateTries(variable, -1)
                updateShopPrices()
                uiShared.updateOnNextTick()
            },
            onClick: () => {
                ui.showTextInput({
                    title: 'title',
                    description: 'description',
                    initialValue: String(index == 0 ? config.getFloat(variable) : config.getTries(variable)),
                    maxLength: 10,
                    callback: (value: string) => {
                        index == 0 ? config.setFloat(variable, value) : config.setTries(variable, value)
                        updateShopPrices()
                        uiShared.updateOnNextTick()
                    }
                })
            }
        }
        y += height + uiShared.padding
        return [label, spinner]
    })

    return [toggleManagePricesRow].concat(spinnerWidgetRows)
}

export function getInfoLabelText() {
    let target = (config.getFloat('target') * 100).toFixed(0)
    return `${target}% of guests should buy a food item\nafter ${config.getTries('food')} tries, a souvenir after ${config.getTries('souvenir')},\nand a photo after ${config.getTries('photo')}`
}


export function createToggleManagePricesButton(): WidgetDesc {

    return {
        x: 0,
        y: 0,
        height: 10,
        width: 10,
        isChecked: config.getBoolean('enable-price-management'),
        name: "toggle-manage-prices-button",
        onChange(isChecked: boolean): void {
            config.setBoolean('enable-price-management', isChecked)
        },
        text: "",
        type: "checkbox"


    }
}

export function updateSwitchWindowButton(window: Window): void {
    let button = window.findWidget("switch to tab button")
    button.x = window.width - button.width - uiShared.padding - 10
}