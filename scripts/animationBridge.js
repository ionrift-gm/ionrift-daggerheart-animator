/**
 * Handles integration with Automated Animations (A-A)
 * 
 * @param {string} itemName - Name of the attack (e.g., "Claws")
 * @param {Actor} actor - The actor performing the attack
 * @param {Object} message - The chat message object
 */
export async function handleAnimation(itemName, actor, message) {
    // 1. Check if Automated Animations is active
    if (!game.modules.get("autoanimations")?.active) {
        console.warn("Ionrift Animations | ❌ Automated Animations module is NOT active. Skipping.");
        return;
    }

    // 2. Resolve the Source Token
    // Try to get token from speaker, or actor's active tokens
    let sourceToken = canvas.tokens.get(message.speaker?.token);
    if (!sourceToken && actor) {
        sourceToken = actor.token || actor.getActiveTokens()[0];
    }

    if (!sourceToken) {
        console.warn("Ionrift Animations | ❌ No source token found for animation. Make sure a token is selected or the actor has an active token.");
        return;
    }

    // 3. Resolve Targets
    // Daggerheart usually targets via the game.user.targets set
    const targets = Array.from(game.user.targets);

    // 4. Construct Synthetic Item
    let img = "icons/svg/sword.svg"; // Fallback

    // If it's the standard "attack" (Claws, etc.)
    if (actor.system?.attack?.name === itemName) {
        // Clone the system attack data
        const attackData = foundry.utils.deepClone(actor.system.attack);

        // Construct a ROBUST POJO (Plain Object) to bypass System Validation
        // This ensures properties like 'actionType' exist exactly where AA looks for them.
        const syntheticItem = {
            name: attackData.name || itemName,
            type: "weapon",
            img: attackData.img || img,
            _id: foundry.utils.randomID(),
            uuid: actor.uuid + ".Item." + foundry.utils.randomID(),
            actor: actor, // Link back to actor
            system: {
                attack: attackData,
                actionType: "mwak", // Explicitly for AA
                equipped: true,
                activation: { type: "action" },
                damage: { parts: [] },
                target: { type: "creature" }
            },
            flags: {
                autoanimations: {}
            },
            hasAttack: true,
            hasDamage: true,
            // Mock methods that AA or Foundry might call
            getFlag: function (scope, key) {
                return this.flags[scope]?.[key];
            },
            // Mock methods for AA flag migration/updates
            update: async function (updates) {
                foundry.utils.mergeObject(this, updates);
                return this;
            },
            setFlag: async function (scope, key, value) {
                if (!this.flags[scope]) this.flags[scope] = {};
                this.flags[scope][key] = value;
                return this;
            },
            unsetFlag: async function (scope, key) {
                if (this.flags[scope]) delete this.flags[scope][key];
                return this;
            },
            prepareData: () => { },
            getRollData: () => { return actor.getRollData(); }
        };

        console.log(`Ionrift Animations | Triggering Animation for '${itemName}' (Robust POJO)`, syntheticItem);

        if (typeof AutomatedAnimations !== "undefined" && AutomatedAnimations.playAnimation) {
            AutomatedAnimations.playAnimation(sourceToken, syntheticItem, { targets: targets });
        }
        return;
    }

    // Fallback or Standard Item Logic
    // If it's a real item, find it
    const item = actor.items.getName(itemName);
    if (item) {
        // Just play it naturally
        console.log(`Ionrift Animations | Triggering Animation for '${itemName}' (REAL Item)`, item);
        if (typeof AutomatedAnimations !== "undefined" && AutomatedAnimations.playAnimation) {
            // Standard AA call is playAnimation(token, item, options)
            AutomatedAnimations.playAnimation(sourceToken, item, { targets: targets });
        }
        return;
    }
}
