import {config} from "../configuration";
import {updateShopPrices} from "../startup";
import {uiShared} from "./uiShared";

export function buildConfigWidgets() {
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
}