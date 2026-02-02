export class AnimatorDiagnostics {
    static run() {
        console.log("Ionrift Animations | Running Diagnostics...");
        let status = [];

        // 1. Dependency Check
        const aaModule = game.modules.get("autoanimations");
        if (aaModule && aaModule.active) {
            status.push(`✅ Automated Animations active (v${aaModule.version})`);
        } else {
            status.push(`❌ Automated Animations MISSING or INACTIVE`);
        }

        // 2. API Check
        if (typeof AutomatedAnimations !== "undefined" && typeof AutomatedAnimations.playAnimation === "function") {
            status.push(`✅ API 'AutomatedAnimations.playAnimation' found`);
        } else {
            status.push(`❌ API 'AutomatedAnimations.playAnimation' NOT FOUND`);
        }

        // 3. Output
        const msg = `<h3>Ionrift Animator Diagnostics</h3><ul>${status.map(s => `<li>${s}</li>`).join("")}</ul>`;
        ChatMessage.create({ content: msg, speaker: { alias: "Ionrift Debug" } });
        console.log(status);
    }
}
