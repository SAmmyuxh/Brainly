export function random(len: number) {
    let options = "qwertywifoavnouignv12345678";
    let length = options.length;

    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor(Math.random() * length)];
    }
    return ans;
}

export const extractMetadata = async (url: string) => {
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BrainlyBot/1.0)' },
            signal: AbortSignal.timeout(5000)
        });
        const html = await response.text();

        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

        const descriptionMatch =
            html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
            html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i) ||
            html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i) ||
            html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:description"[^>]*>/i);

        const imageMatch =
            html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i) ||
            html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i);

        return {
            title: titleMatch ? titleMatch[1] : undefined,
            description: descriptionMatch ? descriptionMatch[1] : undefined,
            image: imageMatch ? imageMatch[1] : undefined
        };
    } catch (e) {
        return null;
    }
}