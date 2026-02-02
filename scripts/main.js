import { handleAnimation } from "./animationBridge.js";
import { AnimatorDiagnostics } from "./Diagnostics.js";

Hooks.once('ready', async function () {
    console.log("Ionrift Animations | Module Ready");

    // Quick startup check
    const aa = game.modules.get("autoanimations");
    if (aa?.active) {
        console.log(`Ionrift Animations | Readiness Check: Automated Animations v${aa.version} ACTIVE ✅`);
    } else {
        ui.notifications.error("Ionrift Animations requires 'Automated Animations' module!");
        console.error("Ionrift Animations | Readiness Check: Automated Animations MISSING or INACTIVE ❌");
    }
});

Hooks.on("chatMessage", (chatLog, message, chatData) => {
    if (message.trim() === "/ionanim debug") {
        AnimatorDiagnostics.run();
        return false;
    }
});

Hooks.on("createChatMessage", (message) => {
    // Detect if it's a roll
    if (!message.isRoll && !message.rolls?.length) return;

    // Log hook entry for debugging
    console.log("Ionrift Animations | Hook detected. Analyzing roll...");

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
