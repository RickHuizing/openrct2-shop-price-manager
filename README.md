# (Simple) OpenRCT2 plugin for shop price management (BETA)

<b>This is a BETA version, very rudimentary and based on my own preferences. If you would like to see specific features (or work on them) any input is appreciated</b>

A simple and minimal shop price management.
Just add the plugin to your plugin folder and it should work.
Plugin folder found at ~/Documents/OpenRCT2/plugin.

---

## How does it work?
Based on some calculations, sets the price of shop items so that 90% of your guests should buy them.

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
### GUI
For now, GUI only shows some debug stats. When I have more time and if there's interest I'll add some configurations.

Due to some limitations of the OpenRCT2 API, the stats for guests that bought t-shirts are based on guests wearing white tshirts:)

---

## Todo (from initial commit):
- add some configs to the gui
    - enable/disable price management (per category)
    - target percentage per category
    - tries per category
    - manual override per category (add/subtract constant to optimal price)
    - disable umbrella / map price management for optimization / cheese
        - maps increase traversed junctions during pathfinding
        - umbrellas can be sold for insane amounts during rain
    - balloons ?
        - balloons can be dropped so can be sold multiple times
        - other items are dropped as well I think but unsure
- make these configs savable
- show expected percentages based on current prices
    - price is incremented by 0.1 so no exact calculation can be made
- show list of sellable items / items sold in park with current prices
    - kinda cool to see in big parks with lots of updates
