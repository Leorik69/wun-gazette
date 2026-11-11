# WUN Welcome: Cinematic Signal

## Goal

Replace the generic hero greeting with a dignified welcome that combines the
discovery of a new world with the beginning of a new nation.

## Approved Copy

- Kicker: `A nation beyond borders`
- Headline: `Welcome to the nation still becoming.`
- Supporting line:
  `A living digital world, built in public with the people who choose to call it theirs.`

The existing `Zero hype...` paragraph remains a separate supporting card below
the welcome.

## Composition

The welcome stays in the existing translucent dark card in the left hero
column. The headline remains the dominant element and uses the current display
serif. The kicker sits above it. The supporting line sits below it in the sans
typeface. A short luminous gold rule closes the composition.

The emblem, signal tuner, calls to action, and hero grid do not move.

## Motion

The effect combines two approved directions:

1. Signal reveal: headline words enter sequentially from a subtle vertical
   offset and blur.
2. Cinematic light: after the phrase assembles, a restrained cool-to-gold sheen
   crosses the letters while a faint light beam moves behind the text.

A small Neutron pulse appears in the upper-right area of the welcome card. The
complete motion uses one calm cycle of approximately eight seconds. It must not
compete with the emblem.

## Accessibility and Responsive Behaviour

- `prefers-reduced-motion: reduce` displays all copy immediately and disables
  the beam, shimmer, and pulse.
- The text remains real HTML and readable without animation or JavaScript.
- Mobile keeps the same copy but reduces type size and line breaks naturally.
- Decorative effects are excluded from the accessibility tree.
- Contrast remains sufficient over the translucent card.

## Scope

Change only the hero welcome markup and its styles in `D:\wun-gazette`.
Do not alter the emblem, Neutron graph, other sections, approved gold-copy
restriction, signup links, or the main WUN repository.

## Verification

- Confirm the approved copy is visible and the previous hero greeting is gone.
- Check the reveal, sheen, beam, and pulse at desktop and mobile widths.
- Check the reduced-motion state.
- Run `npm run build`.
- Show locally before any production deployment.
