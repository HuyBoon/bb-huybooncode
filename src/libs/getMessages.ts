import { getMessages as fetchMessages } from "next-intl/server";

export async function getMessages(locale: "vi" | "en") {
    return await fetchMessages({ locale });
}
