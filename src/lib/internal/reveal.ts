/** Marks server-rendered elements that start hidden until their attachment takes over. */
export const REVEAL_ATTRIBUTE = 'data-reveal';

export function isRevealTarget(element: Element): boolean {
	return element.hasAttribute(REVEAL_ATTRIBUTE);
}

/**
 * Hands control from `reveal.css` to the attachment.
 *
 * Motion applies an animation's first keyframe on the next animation frame, not synchronously, so
 * removing the attribute right away would leave one frame where the element is fully visible. We
 * wait for that frame instead: Motion's frame callback was registered first (when the animation
 * started), so by the time ours runs the starting styles are already inline.
 *
 * @returns a function that cancels the pending release, for the attachment's cleanup.
 */
export function releaseRevealAfterFirstFrame(element: Element): () => void {
	if (!isRevealTarget(element)) return () => {};

	const id = requestAnimationFrame(() => element.removeAttribute(REVEAL_ATTRIBUTE));
	return () => cancelAnimationFrame(id);
}
