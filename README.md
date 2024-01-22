# OpenRCT2 shop price management

Tired of trying to find the perfect price for all your goodies? Tired of not knowing if your prices are actually working?

No more! Double your profits with this one simple trick. Just install the plugin and let it manage your shops for you!

And remember: happy guests pay more!

Built using [basssiiie](https://github.com/Basssiiie/OpenRCT2-Simple-Typescript-Template)'s plugin template

---
### Instalation

Add `shop-price-manager.js` to your plugin folder for OpenRCT2.

Plugin folder found at `~/Documents/OpenRCT2/plugin.`

---



---

### How does it work?

Calculates optimal prices so that 90%(configurable) of guests will buy your items after a certain amount of tries.

To increase prices as much as possible, food items have a 90% buy chance with 2 tries, souvenirs with 3 tries and on-ride photo's with 5 tries.

This means you should build plenty of shops because a lot of the time, guests will find your prices too expensive.

Reasoning behind these values:
 - food is a necessity for energy, so should be bought easily.
 - Souvenirs are luxury, and only bought once so should have a higher price.
 - Photo's can be bought only once per ride type (4 types), and guests will ride a lot of coasters so many tries is acceptable.


#### Basics of calculations are this:

Shop items have a base value based on the current temperature. Guests will always buy the item if the current price is equal to the current value.

If the item is more expensive than the current value, the probability a guest will buy the item is based on their happiness level.

Roughly speaking, guests with a happiness >=180 have a 4x higher chance of buying the item, and happiness >= 128 2x chance.

There is a reddit post out there explaining all this, I'll link to it in the future.

---

## Todo:
- make GUI configurable, add button to toggle tabs for each item
- add some configs to the gui
    - enable/disable price management (per category)
    - target percentage per category
    - manual override per category (add/subtract constant to optimal price)
    - disable umbrella / map price management for optimization / cheese
        - maps increase traversed junctions during pathfinding
        - umbrellas can be sold for insane amounts during rain
    - balloons ?
        - balloons can be dropped so can be sold multiple times
        - other items are dropped as well I think but unsure
