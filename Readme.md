# DiscordBot
Discord Müzik Botu

## Komutlar
| Komut | Türkçe | Açıklama |
|-------|--------|----------|
| `!help` | `!yardım` | Yardım menüsünü gösterir. |
| `!play <song name>` | `!çal <şarkı adı>` | Şarkıyı çalar. |
| `!stop` | `!durdur` | Çalan şarkıyı durdurur. |
| `!pause` | `!duraklat` | Çalan şarkıyı duraklatır. |
| `!resume` | `!devam` | Duraklatılan şarkıyı devam ettirir. |
| `!skip` | `!geç` | Çalan şarkıyı atlar. |
| `!queue` | `!liste` | Çalma listesini gösterir. |
| `!clear` | `!temizle` | Çalma listesini temizler. |

## Kurlulum
1. Node.js ve npm kurulu olmalıdır.
2. Projeyi klonlayın:
   ```bash
   git clone https://github.com/teyfikahmet/DiscordBot.git
   ```
3. Proje dizinine gidin:
   ```bash
   cd DiscordBot
   ```
4. Gerekli paketleri yükleyin:
   ```bash
   npm install
   ```
5. `.env.sample` dosyasını `.env` olarak yeniden adlandırın ve gerekli bilgileri doldurun:
   ```bash
   cp .env.sample .env
   ```
   `.env` dosyasında `DISCORD_TOKEN` ve diğer gerekli bilgileri doldurun.
   Örnek:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   ```
   Diğer ayarlar için `.env.sample` dosyasına bakabilirsiniz.
6. Botu başlatın:
   ```bash
   npm start
   ```