import { handleAnimation } from "./animationBridge.js";

Hooks.once('ready', async function () {
    console.log("Ionrift Animations | Module Ready");
});

Hooks.on("createChatMessage", (message) => {
    // Detect if it's a roll
    if (!message.isRoll && !message.rolls?.length) return;

    const roll = message.rolls[0];

    // Extract Item Name from Roll Options (e.g. "Unleash Chaos: Cast")
    let itemName = "Generic";
    if (roll.options && roll.options.title) {
        itemName = roll.options.title.split(":")[0].trim();
    } else if (roll.data && roll.data.name) {
        itemName = roll.data.name; // Fallback
    }

    // Also try to get the Actor Name for Adversary lookups
    const speakerId = message.speaker?.actor;
    let actor = null;
    if (speakerId) {
        actor = game.actors.get(speakerId);
    }

    if (actor) {
        // Fire animation async
        handleAnimation(itemName, actor, message).catch(err =>
            console.error("Ionrift Animations | Animation Error", err)
        );
    }
});
