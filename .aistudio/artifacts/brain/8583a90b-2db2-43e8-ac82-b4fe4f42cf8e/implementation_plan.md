# Achievements System, Profile Screen & European Character Portraits

## Summary
Implement a comprehensive milestone and achievements system with a player profile popup accessible from the top status bar during story dialogue, real-time unlock toast alerts with audio chimes, and generate dedicated European character portraits for **Yeva (Eva)** and **Sofija** based on their detailed facial anatomical descriptions.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified and confirmed with the user:
> - **Display Location**: The player profile and achievements modal will be directly accessible via the top status bar in the story HUD (tapping Amelia's profile / milestone badge).
> - **Unlock Behavior**: An animated toast notification badge will slide down with a cheerful chime whenever an achievement milestone is unlocked during dialogue, swimming, or texting.
> - **Character Visual Direction**: High-fidelity, realistic digital illustration portraits for **Yeva (Eva)** and **Sofija** preserving natural proportions, subtle facial asymmetry, and European Lithuanian features (non-Asian, non-anime).

---

## 1. Overview & Core Concept

### What It Does
- **Milestone & Achievement Engine**: Tracks player progress across multiple narrative and athletic dimensions:
  - *Perfect Swim* (Tobulas plaukimas): Achieve 5+ perfect strokes in a single race.
  - *Deep Conversations* (Gilus ryšys): Reach affection level 5+ with Dima, Artem, or Roma.
  - *Heart of Kaunas* (Kauno širdis): Chat with all members of the Gymnasium squad.
  - *Chlorine & Starlight* (Aukso medalis): Win the Baltic Junior Swimming Championship finals.
  - *Midnight Poet* (Naktinis poetas): Complete a late-night messaging exchange with Roma.
  - *Gymnasium Royalty* (Pokylio karalienė): Accept Artem's slow dance invitation for Friday night.
- **Top Status Bar Profile & Trophy Hub**: Accessible anytime from the story header. Tapping Amelia's avatar or trophy icon opens a sleek, mobile-optimized player profile sheet displaying:
  - Amelia's athletic & academic card.
  - Unlocked / in-progress achievements with progress bars and unlocked timestamps.
  - Current romance meters with Dima, Artem, and Roma.
  - Fastest 50m / 100m lap time.
- **Real-Time Notification Banner**: Instant popup toast whenever a milestone is unlocked, playing an audio chime and displaying the achievement badge without interrupting dialogue flow.
- **European Portraits for Yeva & Sofija**:
  - **Yeva (Eva)**: Softly elongated oval face, natural almond eyes with defined upper lids, naturally full brows, straight nose with rounded tip, natural lips, medium-to-dark brown hair pulled back with center part.
  - **Sofija**: Youthful softly rounded oval face, fuller natural rosy cheeks, delicate rounded jawline, open calm hazel eyes, small straight nose with subtly elevated rounded tip, light brown/dark blonde hair with warm golden tones.

---

## 2. User Experience & Visual Design

### Touch-Friendly Mobile Layout
- **Mobile First Touch Targets**: Profile trigger in top bar has $\ge 44 \times 44\text{px}$ touch area.
- **Modal Drawer**: Opens as a smooth bottom sheet on mobile devices (`max-h-[85vh]` with drag handle) and an elegant centered card on desktop (`max-w-md`).
- **Achievement Cards**:
  - Unlocked: Vibrant sky/amber gradient ring, unlocked date, description, and gold medal badge.
  - Locked: Discreet translucent slate panel with progress bar (e.g. `3/5 Perfect Strokes`).
- **Toast Banner**: Floats at the top of the viewport (`top-4 z-50`) with an animated slide-in, glowing gold border, and auto-dismiss after 3.2 seconds.

```
┌────────────────────────────────────────────────────────┐
│ [🏆 Tobulas plaukimas atrakintas! +50 XP]             │  <-- Animated Toast
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ [PIRM · Rytas]      [D:4 · A:3 · R:2]     [🏆 Profilis]│  <-- Top Story HUD
└────────────────────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

1. **State Persistence**:
   - *Approach*: Store unlocked achievement IDs, progress counters, and unlock timestamps in the existing `PlayerStats` model backed by `localStorage`.
   - *Rationale*: Guarantees zero data loss across reloads and seamless synchronization with existing save/load states.

2. **Dialog Non-Intrusiveness**:
   - *Approach*: Real-time toasts float above the scene and dismiss automatically without stealing focus from typewriter text or dialogue choices.
   - *Rationale*: Ensures romantic story immersion and rapid swimming arcade gameplay remain smooth and unhindered.

---

## 4. Technical Architecture & Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                               │
│  - achievementsState: Set<string>                               │
│  - unlockAchievement(id, title, desc, icon)                     │
│  - activeToast: AchievementToast | null                         │
└───────────────┬───────────────────────────────┬─────────────────┘
                │                               │
                ▼                               ▼
    ┌───────────────────────┐       ┌───────────────────────┐
    │ VisualNovelDialog.tsx │       │ SwimmingMinigame.tsx  │
    │ - Top HUD Trophy Pill │       │ - Perfect stroke event│
    │ - Opens Profile Modal │       │ - Touchpad win event  │
    └───────────┬───────────┘       └───────────────────────┘
                │
                ▼
    ┌───────────────────────────────────────────────┐
    │           ProfileAchievementsModal            │
    │  - Amelia Card (Kaunas Gym Swimmer Profile)   │
    │  - Milestones Grid (Unlocked / In Progress)   │
    │  - Romance & Swim Records                     │
    └───────────────────────────────────────────────┘
```

### Component & File Changes
1. `src/types.ts`: Define `Achievement` interface, milestone identifiers, and update `PlayerStats`.
2. `src/data/achievements.ts`: Curated list of bilingual achievements (Lithuanian & English) with criteria and icons.
3. `src/data/characters.ts`: Integrate new generated European portraits for Yeva and Sofija.
4. `src/components/ProfileAchievementsModal.tsx`: New dedicated mobile-responsive profile modal with tabs for Milestones and Stats.
5. `src/components/AchievementToast.tsx`: Animated slide-down notification badge.
6. `src/components/VisualNovelDialog.tsx`: Add profile trigger button to top HUD and render profile modal.
7. `src/services/sound.ts`: Add achievement unlock fanfare sound effect.
