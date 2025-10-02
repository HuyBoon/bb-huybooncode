import { getMessages as fetchMessages } from "next-intl/server";

export async function getMessages(locale: "vi" | "en" | "ru" | "ko" | "zh") {
    return await fetchMessages({ locale });
}
