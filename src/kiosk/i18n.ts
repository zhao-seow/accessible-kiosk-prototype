export type Lang = "en" | "zh" | "ms" | "ta";

export const LANGUAGES: { code: Lang; label: string; bcp47: string }[] = [
  { code: "en", label: "English", bcp47: "en-SG" },
  // Use widely-installed tags: zh-SG / ta-SG voices rarely exist on real devices,
  // so requesting them makes the browser fall back to the default (English) voice.
  { code: "zh", label: "中文", bcp47: "zh-CN" },
  { code: "ms", label: "Bahasa Melayu", bcp47: "ms-MY" },
  { code: "ta", label: "தமிழ்", bcp47: "ta-IN" },
];

export const bcp47ForLang = (lang: Lang): string =>
  LANGUAGES.find((l) => l.code === lang)?.bcp47 ?? "en-SG";

// Language-family aliases so we can still match a voice when the engine labels
// it differently (e.g. Mandarin as "cmn-*" rather than "zh-*").
const LANG_ALIASES: Record<string, string[]> = {
  zh: ["zh", "cmn", "yue"],
  en: ["en"],
  ms: ["ms", "zsm", "id"],
  ta: ["ta"],
};

export const langFamiliesFor = (bcp47: string): string[] => {
  const base = bcp47.replace("_", "-").split("-")[0].toLowerCase();
  return LANG_ALIASES[base] ?? [base];
};
