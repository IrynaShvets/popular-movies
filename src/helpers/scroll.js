export default function scroll() {
  let scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );

  window.scrollBy({
    top: scrollHeight * -2,
    behavior: "auto",
  });
}
