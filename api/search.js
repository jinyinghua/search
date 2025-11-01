// Vercel Serverless Function
// 它会处理所有对 /api/search 的请求

export default async function handler(request, response) {
    // 从请求的 URL query string 中获取搜索词 (e.g., /api/search?query=hello)
        const { query } = request.query;

            if (!query) {
                    return response.status(400).json({ error: 'Query parameter is required' });
                        }

                            // 从环境变量中安全地获取密钥和ID
                                const apiKey = process.env.GOOGLE_API_KEY;
                                    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

                                        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

                                            try {
                                                    const googleResponse = await fetch(url);
                                                            if (!googleResponse.ok) {
                                                                        // 如果Google API返回错误，则将错误信息传递给前端
                                                                                    const errorData = await googleResponse.json();
                                                                                                console.error('Google API Error:', errorData);
                                                                                                            return response.status(googleResponse.status).json({ error: 'Failed to fetch results from Google API.' });
                                                                                                                    }

                                                                                                                            const data = await googleResponse.json();
                                                                                                                                    
                                                                                                                                            // 成功后，将Google返回的数据发送给前端
                                                                                                                                                    return response.status(200).json(data);

                                                                                                                                                        } catch (error) {
                                                                                                                                                                console.error('Server-side Error:', error);
                                                                                                                                                                        return response.status(500).json({ error: 'An internal server error occurred.' });
                                                                                                                                                                            }
                                                                                                                                                                            }