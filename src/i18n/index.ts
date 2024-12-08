import { en } from "./en";
import { zh } from "./zh";
import { ja } from "./ja";

export type Language = "en" | "zh" | "ja";
export type Translation = typeof en;

export const translations: Record<Language, Translation> = {
    en,
    zh,
    ja,
};

export const useTranslation = (lang: Language) => {
    return translations[lang];
};

export const formatMoney = (amount: number, lang: Language) => {
    const { format, symbol } = translations[lang].currency;
    return `${symbol}${new Intl.NumberFormat(format, {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)}`;
};
