import { THEME_STORAGE_KEY } from "@/lib/theme";

/** Рання ініціалізація теми (до гідрації), щоб уникнути спалаху світлої теми */
export function ThemeScript() {
  const js = `(function(){
  try {
    var k = ${JSON.stringify(THEME_STORAGE_KEY)};
    var s = localStorage.getItem(k);
    var d = document.documentElement;
    var dark = s === "dark" || (s !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) d.classList.add("dark"); else d.classList.remove("dark");
  } catch (e) {}
})();`;

  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
