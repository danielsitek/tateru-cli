
export const getTranslationKeys = (configOptionLang: any, lang?: string): string[] => {
    if (lang) {
        return [lang];
    }

    return Object.keys(configOptionLang);
};
