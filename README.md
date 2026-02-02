# Daggerheart Animator (Ionrift)

**The missing bridge between Daggerheart and Automated Animations.**

Daggerheart Animator is a specialized middleware that allows generic Daggerheart attacks (like "Claws", "Bite", or "Melee")—which are often just data objects on an actor—to trigger robust animations via the [Automated Animations](https://foundryvtt.com/packages/autoanimations) module.

## Why is this needed?
In Daggerheart, many adversary attacks are not invalid "Items" in the Foundry sense, preventing Automated Animations from treating them as standard weapon attacks. This module "fakes" a valid item during the roll so that animation hooks fire correctly.

## Installation
1.  Install **Automated Animations** and **Daggerheart**.
2.  Install this module (`ionrift-daggerheart-animator`).
3.  Enable all three.

## Setup & Usage
1.  Open **Automated Animations** settings.
2.  Go to **Global Automatch**.
3.  Add entries for your common attack names (e.g., "Claws", "Bite", "Slam").
    *   *Tip: Use the "Melee" category for generic swings.*
4.  Roll an attack from a Daggerheart PC or NPC sheet.
5.  Receive animations!

## Support
If you find this module useful, consider supporting the project:
[**Patreon / Buy me a Coffee**](https://patreon.com/ionrift)

More Daggerheart tools are in the works!

## License
MIT
