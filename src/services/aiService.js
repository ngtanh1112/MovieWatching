// aiService.js - Service để gọi API AI

const AI_CONFIG = {
  // Hugging Face Inference API (MIỄN PHÍ - không cần API key)
  HUGGINGFACE_API_URL: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
  // Cohere API (MIỄN PHÍ - có giới hạn)
  COHERE_API_URL: 'https://api.cohere.ai/v1/generate',
  // OpenAI API (cần API key)
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  // Fallback API
  FALLBACK_API_URL: 'https://api.example.com/chat',
  // Model mặc định
  DEFAULT_MODEL: 'gpt-3.5-turbo',
  // Cấu hình mặc định
  DEFAULT_CONFIG: {
    max_tokens: 500,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  }
};

// System prompt cho AI assistant về phim
const SYSTEM_PROMPT = `Bạn là một AI assistant chuyên về phim ảnh và giải trí. Bạn có thể giúp người dùng:

1. **Tìm hiểu về phim ảnh:**
   - Thông tin về các bộ phim nổi tiếng
   - Đánh giá và review phim
   - So sánh các bộ phim
   - Tìm hiểu về thể loại phim

2. **Gợi ý phim:**
   - Phim theo thể loại yêu thích
   - Phim theo quốc gia (Hàn Quốc, Trung Quốc, US-UK, Nhật Bản)
   - Phim theo năm sản xuất
   - Phim anime và hoạt hình

3. **Thông tin về ngành điện ảnh:**
   - Diễn viên nổi tiếng
   - Đạo diễn tài năng
   - Xu hướng phim hiện tại
   - Lịch sử điện ảnh

4. **Hỗ trợ tìm kiếm:**
   - Cách tìm phim phù hợp
   - Các nguồn xem phim hợp pháp
   - Đánh giá chất lượng phim

Hãy trả lời bằng tiếng Việt một cách thân thiện, hữu ích và chính xác. Nếu không biết thông tin cụ thể, hãy đưa ra gợi ý chung hoặc hướng dẫn người dùng tìm kiếm trên trang web.`;

// Hàm gọi Mock AI API (MIỄN PHÍ - mô phỏng AI thật)
export const callMockAI = async (userMessage) => {
  try {
    // Mô phỏng delay của API thật
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const message = userMessage.toLowerCase();
    
    // AI responses thông minh dựa trên từ khóa
    if (message.includes('phim hot') || message.includes('phim mới')) {
      return `🔥 **Phim hot hiện tại:**

**Top phim Hàn Quốc:**
• Squid Game (2021) - 9.2/10
• Parasite (2019) - 8.6/10  
• Train to Busan (2016) - 7.6/10
• The Glory (2023) - 8.1/10

**Top phim Trung Quốc:**
• Wandering Earth 2 (2023) - 7.4/10
• Ne Zha (2019) - 7.4/10
• The Wandering Earth (2019) - 7.0/10

**Top phim US-UK:**
• Top Gun: Maverick (2022) - 8.3/10
• Spider-Man: No Way Home (2021) - 8.2/10
• Dune (2021) - 8.0/10

**Anime phổ biến:**
• Demon Slayer (2019) - 8.7/10
• Attack on Titan (2013) - 9.0/10
• Jujutsu Kaisen (2020) - 8.5/10

Hãy khám phá các danh mục trên trang web để xem chi tiết! 🎬`;
    }
    
    if (message.includes('thể loại') || message.includes('loại phim')) {
      return `🎬 **Các thể loại phim phổ biến:**

**Hành động:** Fast & Furious, John Wick, Mission Impossible, Mad Max
**Tình cảm:** Titanic, The Notebook, La La Land, Before Sunrise
**Hài hước:** Deadpool, The Hangover, Minions, Superbad
**Kinh dị:** The Conjuring, It, Get Out, Hereditary
**Khoa học viễn tưởng:** Avatar, Interstellar, Blade Runner, Dune
**Hoạt hình:** Toy Story, Frozen, Spirited Away, Inside Out
**Anime:** Your Name, Spirited Away, Attack on Titan, Demon Slayer
**Tài liệu:** Free Solo, March of the Penguins, Won't You Be My Neighbor?

**Gợi ý:** Bạn có thể sử dụng bộ lọc trên trang web để tìm phim theo thể loại yêu thích! 🎯`;
    }
    
    if (message.includes('gợi ý') || message.includes('đề xuất')) {
      return `💡 **Gợi ý phim theo sở thích:**

**Nếu bạn thích phim tình cảm:**
• The Notebook (2004) - 7.8/10
• La La Land (2016) - 8.0/10
• Before Sunrise (1995) - 8.1/10
• Eternal Sunshine of the Spotless Mind (2004) - 8.3/10

**Nếu bạn thích phim hành động:**
• John Wick (2014) - 7.4/10
• Mad Max: Fury Road (2015) - 8.1/10
• The Raid (2011) - 7.6/10
• Mission: Impossible - Fallout (2018) - 7.7/10

**Nếu bạn thích phim hài:**
• Deadpool (2016) - 8.0/10
• The Hangover (2009) - 7.7/10
• Superbad (2007) - 7.6/10
• Anchorman (2004) - 7.2/10

**Nếu bạn thích anime:**
• Your Name (2016) - 8.2/10
• Spirited Away (2001) - 8.6/10
• A Silent Voice (2016) - 8.1/10
• Princess Mononoke (1997) - 8.4/10

Bạn có thể sử dụng bộ lọc trên trang web để tìm phim phù hợp! 🎯`;
    }
    
    if (message.includes('diễn viên') || message.includes('actor')) {
      return `🎭 **Một số diễn viên nổi tiếng:**

**Hollywood:**
• Leonardo DiCaprio - Titanic, Inception, The Revenant
• Tom Hanks - Forrest Gump, Cast Away, Saving Private Ryan
• Meryl Streep - The Devil Wears Prada, Sophie's Choice
• Denzel Washington - Training Day, Fences, The Equalizer

**Hàn Quốc:**
• Song Kang-ho - Parasite, Memories of Murder, The Host
• Park Seo-joon - Itaewon Class, What's Wrong with Secretary Kim
• Kim Tae-ri - The Handmaiden, 25 21, Space Sweepers
• Lee Byung-hun - I Saw the Devil, A Bittersweet Life

**Trung Quốc:**
• Jackie Chan - Rush Hour, Police Story, Drunken Master
• Jet Li - Hero, Fearless, The One
• Zhang Ziyi - Crouching Tiger Hidden Dragon, Memoirs of a Geisha
• Donnie Yen - Ip Man, Rogue One, Mulan

**Anime (Seiyuu):**
• Mamoru Miyano - Death Note, Free!, Your Name
• Kana Hanazawa - Steins;Gate, Psycho-Pass, Tokyo Ghoul
• Hiroshi Kamiya - Attack on Titan, Noragami, Monogatari

Bạn có thể tìm hiểu thêm về diễn viên yêu thích trên trang web! 🌟`;
    }
    
    if (message.includes('đạo diễn') || message.includes('director')) {
      return `🎬 **Các đạo diễn nổi tiếng:**

**Hollywood:**
• Christopher Nolan - Inception, Interstellar, The Dark Knight
• Steven Spielberg - Jaws, E.T., Jurassic Park, Schindler's List
• Martin Scorsese - Goodfellas, The Wolf of Wall Street, Taxi Driver
• Quentin Tarantino - Pulp Fiction, Kill Bill, Django Unchained

**Hàn Quốc:**
• Bong Joon-ho - Parasite, Snowpiercer, The Host, Memories of Murder
• Park Chan-wook - Oldboy, The Handmaiden, Decision to Leave
• Lee Chang-dong - Burning, Poetry, Secret Sunshine
• Kim Jee-woon - A Tale of Two Sisters, I Saw the Devil

**Trung Quốc:**
• Zhang Yimou - Hero, House of Flying Daggers, Raise the Red Lantern
• Chen Kaige - Farewell My Concubine, The Promise
• Ang Lee - Crouching Tiger Hidden Dragon, Brokeback Mountain, Life of Pi
• Wong Kar-wai - In the Mood for Love, Chungking Express

**Anime:**
• Hayao Miyazaki - Spirited Away, Princess Mononoke, My Neighbor Totoro
• Makoto Shinkai - Your Name, Weathering with You, 5 Centimeters per Second
• Satoshi Kon - Perfect Blue, Paprika, Millennium Actress
• Mamoru Hosoda - The Girl Who Leapt Through Time, Wolf Children

Mỗi đạo diễn đều có phong cách riêng biệt và đáng khám phá! 🎨`;
    }
    
    if (message.includes('năm') || message.includes('2023') || message.includes('2024')) {
      return `📅 **Phim theo năm:**

**2024 (Mới nhất):**
• Dune: Part Two - 8.7/10
• Deadpool & Wolverine - 8.2/10
• Inside Out 2 - 8.5/10
• Wicked - 7.8/10

**2023:**
• Oppenheimer - 8.6/10
• Barbie - 7.3/10
• Spider-Man: Across the Spider-Verse - 8.6/10
• The Super Mario Bros. Movie - 7.0/10

**2022:**
• Top Gun: Maverick - 8.3/10
• Avatar: The Way of Water - 7.8/10
• Black Panther: Wakanda Forever - 7.3/10
• The Batman - 7.8/10

**2021:**
• Dune - 8.0/10
• Spider-Man: No Way Home - 8.2/10
• No Time to Die - 7.3/10
• The Suicide Squad - 7.2/10

Bạn có thể sử dụng bộ lọc năm trên trang web để tìm phim theo năm cụ thể! 📆`;
    }
    
    // Response mặc định thông minh
    return `🎬 **Xin chào! Tôi là AI Assistant của trang web phim.**

Tôi có thể giúp bạn:
• Tìm hiểu về các thể loại phim
• Gợi ý phim hot và phổ biến  
• Thông tin về diễn viên, đạo diễn
• Tư vấn phim theo sở thích
• Phim theo năm sản xuất

**Hãy hỏi tôi về:**
• "Phim hot hiện tại"
• "Thể loại phim nào hay?"
• "Gợi ý phim tình cảm"
• "Diễn viên nổi tiếng"
• "Phim năm 2023"

Hoặc khám phá các danh mục trên trang web để tìm phim yêu thích! 😊

**💡 Mẹo:** Tôi có thể hiểu tiếng Việt và tiếng Anh, hãy hỏi tự nhiên nhé!`;
  } catch (error) {
    console.error('Mock AI Error:', error);
    throw error;
  }
};

// Hàm gọi API OpenAI
export const callOpenAI = async (userMessage, apiKey) => {
  try {
    const response = await fetch(AI_CONFIG.OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        ...AI_CONFIG.DEFAULT_CONFIG
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

// Hàm gọi API fallback (có thể là local API hoặc API khác)
export const callFallbackAPI = async (userMessage) => {
    try {
        // Đây là ví dụ về fallback API, bạn có thể thay đổi theo nhu cầu
        const response = await fetch(AI_CONFIG.FALLBACK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                context: 'movie_assistant'
            })
        });

        if (!response.ok) {
            throw new Error(`Fallback API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.response || data.message || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';
    } catch (error) {
        console.error('Fallback API Error:', error);
        throw error;
    }
};

// Hàm chính để gọi AI với fallback
export const callAI = async (userMessage) => {
  // Sử dụng Mock AI API (MIỄN PHÍ - hoạt động ngay lập tức)
  try {
    console.log('Using Mock AI API...');
    const response = await callMockAI(userMessage);
    return response;
  } catch (error) {
    console.warn('Mock AI failed, using default response:', error);
    
    // Trả về response mặc định dựa trên từ khóa
    return generateDefaultResponse(userMessage);
  }
};

// Hàm tạo response mặc định dựa trên từ khóa
const generateDefaultResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Các từ khóa và response tương ứng
    const responses = {
        'thể loại': `🎬 **Các thể loại phim phổ biến:**

**Hành động:** Fast & Furious, John Wick, Mission Impossible
**Tình cảm:** Titanic, The Notebook, La La Land  
**Hài hước:** Deadpool, The Hangover, Minions
**Kinh dị:** The Conjuring, It, Get Out
**Khoa học viễn tưởng:** Avatar, Interstellar, Blade Runner
**Hoạt hình:** Toy Story, Frozen, Spirited Away
**Anime:** Your Name, Spirited Away, Attack on Titan

Bạn có thể khám phá các thể loại này trên trang web để tìm phim phù hợp!`,

        'phim hot': `🔥 **Phim hot hiện tại:**

**Top phim Hàn Quốc:** Squid Game, Parasite, Train to Busan
**Top phim Trung Quốc:** Wandering Earth, Ne Zha, The Wandering Earth 2
**Top phim US-UK:** Top Gun: Maverick, Spider-Man: No Way Home, Dune
**Anime phổ biến:** Demon Slayer, Attack on Titan, Jujutsu Kaisen

Hãy khám phá các danh mục trên trang web để xem chi tiết!`,

        'gợi ý': `💡 **Gợi ý phim theo sở thích:**

**Nếu bạn thích phim tình cảm:** The Notebook, La La Land, Before Sunrise
**Nếu bạn thích phim hành động:** John Wick, Mad Max, The Raid
**Nếu bạn thích phim hài:** Deadpool, The Hangover, Superbad
**Nếu bạn thích anime:** Your Name, Spirited Away, A Silent Voice
**Nếu bạn thích phim kinh dị:** The Conjuring, It, Hereditary

Bạn có thể sử dụng bộ lọc trên trang web để tìm phim theo thể loại yêu thích!`,

        'diễn viên': `🎭 **Một số diễn viên nổi tiếng:**

**Hollywood:** Leonardo DiCaprio, Tom Hanks, Meryl Streep
**Hàn Quốc:** Song Kang-ho, Park Seo-joon, Kim Tae-ri
**Trung Quốc:** Jackie Chan, Jet Li, Zhang Ziyi
**Anime (Seiyuu):** Mamoru Miyano, Kana Hanazawa, Hiroshi Kamiya

Bạn có thể tìm hiểu thêm về diễn viên yêu thích trên trang web!`,

        'đạo diễn': `🎬 **Các đạo diễn nổi tiếng:**

**Hollywood:** Christopher Nolan, Steven Spielberg, Martin Scorsese
**Hàn Quốc:** Bong Joon-ho, Park Chan-wook, Lee Chang-dong
**Trung Quốc:** Zhang Yimou, Chen Kaige, Ang Lee
**Anime:** Hayao Miyazaki, Makoto Shinkai, Satoshi Kon

Mỗi đạo diễn đều có phong cách riêng biệt và đáng khám phá!`
    };

    // Tìm response phù hợp
    for (const [keyword, response] of Object.entries(responses)) {
        if (message.includes(keyword)) {
            return response;
        }
    }

    // Response mặc định
    return `🎬 **Xin chào! Tôi là AI Assistant của trang web phim.**

Tôi có thể giúp bạn:
- Tìm hiểu về các thể loại phim
- Gợi ý phim hot và phổ biến  
- Thông tin về diễn viên, đạo diễn
- Tư vấn phim theo sở thích

Hãy hỏi tôi về:
- "Thể loại phim nào hay?"
- "Phim hot hiện tại"
- "Gợi ý phim tình cảm"
- "Diễn viên nổi tiếng"

Hoặc khám phá các danh mục trên trang web để tìm phim yêu thích! 😊`;
};

export default {
  callAI,
  callMockAI,
  callOpenAI,
  callFallbackAPI,
  generateDefaultResponse
};
