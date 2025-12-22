// ============================================
// TWITTER WEB UYGULAMASI - BACKEND SERVER
// Node.js + Express.js + PostgreSQL
// ============================================

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

// Dotenv'i yükle (varsa)
try {
    require('dotenv').config();
} catch (e) {
    console.log('dotenv yüklenmedi, varsayılan ayarlar kullanılacak');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL bağlantı havuzu
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '123456'
});

// Veritabanı bağlantısını test et
pool.connect((err, client, release) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
        console.log('\n⚠️  Lütfen .env dosyasındaki veritabanı ayarlarını kontrol edin.');
    } else {
        console.log('✅ PostgreSQL veritabanına başarıyla bağlandı!');
        release();
    }
});

// ============================================
// API ENDPOINT'LERİ
// ============================================

// 1. Tüm kullanıcıları getir
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.user_id,
                u.username,
                u.display_name,
                u.bio,
                u.profile_image,
                u.is_verified,
                u.created_at,
                (SELECT COUNT(*) FROM follows f WHERE f.following_id = u.user_id) AS followers_count,
                (SELECT COUNT(*) FROM follows f WHERE f.follower_id = u.user_id) AS following_count,
                (SELECT COUNT(*) FROM tweets t WHERE t.user_id = u.user_id) AS tweets_count
            FROM users u
            ORDER BY followers_count DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Kullanıcılar getirilemedi:', err.message);
        res.status(500).json({ error: 'Kullanıcılar getirilemedi' });
    }
});

// 2. Tüm tweetleri getir (timeline)
app.get('/api/tweets', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                t.tweet_id,
                t.content,
                t.like_count,
                t.retweet_count,
                t.created_at,
                u.user_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.is_verified,
                (SELECT COUNT(*) FROM comments c WHERE c.tweet_id = t.tweet_id) AS comments_count
            FROM tweets t
            JOIN users u ON t.user_id = u.user_id
            ORDER BY t.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Tweetler getirilemedi:', err.message);
        res.status(500).json({ error: 'Tweetler getirilemedi' });
    }
});

// 3. Yeni tweet ekle
app.post('/api/tweets', async (req, res) => {
    const { user_id, content } = req.body;

    if (!user_id || !content) {
        return res.status(400).json({ error: 'user_id ve content zorunludur' });
    }

    if (content.length > 280) {
        return res.status(400).json({ error: 'Tweet 280 karakteri geçemez' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO tweets (user_id, content, created_at, like_count, retweet_count)
            VALUES ($1, $2, CURRENT_TIMESTAMP, 0, 0)
            RETURNING *
        `, [user_id, content]);

        // Hashtag'leri çıkar ve kaydet
        const hashtags = content.match(/#[\wığüşöçİĞÜŞÖÇ]+/g);
        if (hashtags) {
            for (const tag of hashtags) {
                const tagName = tag.substring(1).toLowerCase();

                // Hashtag'i ekle veya var olanı al
                const hashtagResult = await pool.query(`
                    INSERT INTO hashtags (tag_name)
                    VALUES ($1)
                    ON CONFLICT (tag_name) DO UPDATE SET tag_name = $1
                    RETURNING hashtag_id
                `, [tagName]);

                // Tweet-hashtag ilişkisini ekle
                await pool.query(`
                    INSERT INTO tweet_hashtags (tweet_id, hashtag_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                `, [result.rows[0].tweet_id, hashtagResult.rows[0].hashtag_id]);
            }
        }

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Tweet eklenemedi:', err.message);
        res.status(500).json({ error: 'Tweet eklenemedi' });
    }
});

// 4. Tweet beğen
app.post('/api/tweets/:id/like', async (req, res) => {
    const tweetId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id zorunludur' });
    }

    try {
        // Beğeni kontrolü
        const existingLike = await pool.query(
            'SELECT * FROM likes WHERE user_id = $1 AND tweet_id = $2',
            [user_id, tweetId]
        );

        if (existingLike.rows.length > 0) {
            // Beğeniyi kaldır
            await pool.query(
                'DELETE FROM likes WHERE user_id = $1 AND tweet_id = $2',
                [user_id, tweetId]
            );
            await pool.query(
                'UPDATE tweets SET like_count = like_count - 1 WHERE tweet_id = $1',
                [tweetId]
            );
            res.json({ message: 'Beğeni kaldırıldı', liked: false });
        } else {
            // Beğeni ekle
            await pool.query(
                'INSERT INTO likes (user_id, tweet_id) VALUES ($1, $2)',
                [user_id, tweetId]
            );
            await pool.query(
                'UPDATE tweets SET like_count = like_count + 1 WHERE tweet_id = $1',
                [tweetId]
            );
            res.json({ message: 'Tweet beğenildi', liked: true });
        }
    } catch (err) {
        console.error('Beğeni işlemi başarısız:', err.message);
        res.status(500).json({ error: 'Beğeni işlemi başarısız' });
    }
});

// 5. Trending hashtag'ler
app.get('/api/hashtags', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                h.hashtag_id,
                h.tag_name,
                COUNT(th.tweet_id) AS usage_count
            FROM hashtags h
            JOIN tweet_hashtags th ON h.hashtag_id = th.hashtag_id
            GROUP BY h.hashtag_id, h.tag_name
            ORDER BY usage_count DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Hashtag\'ler getirilemedi:', err.message);
        res.status(500).json({ error: 'Hashtag\'ler getirilemedi' });
    }
});

// 6. Belirli hashtag'e göre tweetleri getir
app.get('/api/hashtags/:tag/tweets', async (req, res) => {
    const tagName = req.params.tag.toLowerCase();

    try {
        const result = await pool.query(`
            SELECT 
                t.tweet_id,
                t.content,
                t.like_count,
                t.retweet_count,
                t.created_at,
                u.user_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.is_verified
            FROM tweets t
            JOIN users u ON t.user_id = u.user_id
            JOIN tweet_hashtags th ON t.tweet_id = th.tweet_id
            JOIN hashtags h ON th.hashtag_id = h.hashtag_id
            WHERE h.tag_name = $1
            ORDER BY t.created_at DESC
        `, [tagName]);
        res.json(result.rows);
    } catch (err) {
        console.error('Tweetler getirilemedi:', err.message);
        res.status(500).json({ error: 'Tweetler getirilemedi' });
    }
});

// 7. Kullanıcı istatistikleri
app.get('/api/users/:id/stats', async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query(`
            SELECT 
                u.user_id,
                u.username,
                u.display_name,
                u.bio,
                u.profile_image,
                u.is_verified,
                u.created_at,
                (SELECT COUNT(*) FROM tweets t WHERE t.user_id = u.user_id) AS tweets_count,
                (SELECT COUNT(*) FROM follows f WHERE f.following_id = u.user_id) AS followers_count,
                (SELECT COUNT(*) FROM follows f WHERE f.follower_id = u.user_id) AS following_count,
                (SELECT COUNT(*) FROM likes l WHERE l.user_id = u.user_id) AS likes_given,
                (SELECT COALESCE(SUM(t.like_count), 0) FROM tweets t WHERE t.user_id = u.user_id) AS likes_received
            FROM users u
            WHERE u.user_id = $1
        `, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Kullanıcı istatistikleri getirilemedi:', err.message);
        res.status(500).json({ error: 'Kullanıcı istatistikleri getirilemedi' });
    }
});

// 8. Tweet'in yorumlarını getir
app.get('/api/tweets/:id/comments', async (req, res) => {
    const tweetId = req.params.id;

    try {
        const result = await pool.query(`
            SELECT 
                c.comment_id,
                c.content,
                c.created_at,
                u.user_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.is_verified
            FROM comments c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.tweet_id = $1
            ORDER BY c.created_at ASC
        `, [tweetId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Yorumlar getirilemedi:', err.message);
        res.status(500).json({ error: 'Yorumlar getirilemedi' });
    }
});

// 9. Yorum ekle
app.post('/api/tweets/:id/comments', async (req, res) => {
    const tweetId = req.params.id;
    const { user_id, content } = req.body;

    if (!user_id || !content) {
        return res.status(400).json({ error: 'user_id ve content zorunludur' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO comments (user_id, tweet_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [user_id, tweetId, content]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Yorum eklenemedi:', err.message);
        res.status(500).json({ error: 'Yorum eklenemedi' });
    }
});

// 10. En popüler tweetler
app.get('/api/tweets/popular', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                t.tweet_id,
                t.content,
                t.like_count,
                t.retweet_count,
                t.created_at,
                u.user_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.is_verified,
                (t.like_count + t.retweet_count) AS engagement
            FROM tweets t
            JOIN users u ON t.user_id = u.user_id
            ORDER BY engagement DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Popüler tweetler getirilemedi:', err.message);
        res.status(500).json({ error: 'Popüler tweetler getirilemedi' });
    }
});

// 11. En çok takipçisi olan kullanıcılar (SORGU 1)
app.get('/api/users/top-followers', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.user_id,
                u.username,
                u.display_name,
                u.is_verified,
                u.profile_image,
                COUNT(f.follower_id) AS followers_count
            FROM users u
            LEFT JOIN follows f ON u.user_id = f.following_id
            GROUP BY u.user_id, u.username, u.display_name, u.is_verified, u.profile_image
            ORDER BY followers_count DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Top followers getirilemedi:', err.message);
        res.status(500).json({ error: 'Top followers getirilemedi' });
    }
});

// 12. Kullanıcı Timeline'ı - takip edilen kişilerin tweetleri (SORGU 4)
app.get('/api/users/:id/timeline', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query(`
            SELECT 
                t.tweet_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.is_verified,
                t.content,
                t.like_count,
                t.retweet_count,
                t.created_at,
                (SELECT COUNT(*) FROM comments c WHERE c.tweet_id = t.tweet_id) AS comments_count
            FROM tweets t
            JOIN users u ON t.user_id = u.user_id
            WHERE t.user_id IN (
                SELECT following_id 
                FROM follows 
                WHERE follower_id = $1
            )
            ORDER BY t.created_at DESC
            LIMIT 20
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Timeline getirilemedi:', err.message);
        res.status(500).json({ error: 'Timeline getirilemedi' });
    }
});

// 13. Karşılıklı takipleşenler (Mutual Follows) (SORGU 5)
app.get('/api/users/:id/mutuals', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query(`
            SELECT 
                u.user_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.is_verified
            FROM follows f1
            JOIN follows f2 ON f1.follower_id = f2.following_id 
                AND f1.following_id = f2.follower_id
            JOIN users u ON f1.following_id = u.user_id
            WHERE f1.follower_id = $1
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Mutuals getirilemedi:', err.message);
        res.status(500).json({ error: 'Mutuals getirilemedi' });
    }
});

// 14. Son 7 günde en aktif kullanıcılar (SORGU 6)
app.get('/api/users/active', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.user_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.is_verified,
                COUNT(t.tweet_id) AS tweet_count,
                MAX(t.created_at) AS last_tweet_date
            FROM users u
            JOIN tweets t ON u.user_id = t.user_id
            WHERE t.created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
            GROUP BY u.user_id, u.username, u.display_name, u.profile_image, u.is_verified
            ORDER BY tweet_count DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Active users getirilemedi:', err.message);
        res.status(500).json({ error: 'Active users getirilemedi' });
    }
});

// 15. En çok yorum alan tweetler (SORGU 7)
app.get('/api/tweets/most-commented', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                t.tweet_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.is_verified,
                t.content,
                COUNT(c.comment_id) AS comments_count,
                t.like_count,
                t.retweet_count,
                t.created_at
            FROM tweets t
            JOIN users u ON t.user_id = u.user_id
            LEFT JOIN comments c ON t.tweet_id = c.tweet_id
            GROUP BY t.tweet_id, u.username, u.display_name, u.profile_image, u.is_verified, t.content, t.like_count, t.retweet_count, t.created_at
            ORDER BY comments_count DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Most commented tweets getirilemedi:', err.message);
        res.status(500).json({ error: 'Most commented tweets getirilemedi' });
    }
});

// 16. Tarih aralığına göre tweetler (SORGU 10)
app.get('/api/tweets/date-range', async (req, res) => {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
        return res.status(400).json({ error: 'start_date ve end_date zorunludur' });
    }

    try {
        const result = await pool.query(`
            SELECT 
                t.tweet_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.is_verified,
                t.content,
                t.like_count,
                t.retweet_count,
                t.created_at,
                (SELECT COUNT(*) FROM comments c WHERE c.tweet_id = t.tweet_id) AS comments_count
            FROM tweets t
            JOIN users u ON t.user_id = u.user_id
            WHERE t.created_at BETWEEN $1 AND $2
            ORDER BY t.created_at DESC
        `, [start_date, end_date]);
        res.json(result.rows);
    } catch (err) {
        console.error('Date range tweets getirilemedi:', err.message);
        res.status(500).json({ error: 'Date range tweets getirilemedi' });
    }
});

// 17. Kullanıcının tweetlerini getir
app.get('/api/users/:id/tweets', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query(`
            SELECT 
                t.tweet_id,
                t.content,
                t.like_count,
                t.retweet_count,
                t.created_at,
                u.user_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.is_verified,
                (SELECT COUNT(*) FROM comments c WHERE c.tweet_id = t.tweet_id) AS comments_count
            FROM tweets t
            JOIN users u ON t.user_id = u.user_id
            WHERE t.user_id = $1
            ORDER BY t.created_at DESC
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('User tweets getirilemedi:', err.message);
        res.status(500).json({ error: 'User tweets getirilemedi' });
    }
});

// 18. Kullanıcı etkileşimleri (BONUS SORGU)
app.get('/api/users/:id/interactions', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query(`
            SELECT 
                u.username,
                t.tweet_id,
                t.content,
                (SELECT COUNT(*) FROM likes l WHERE l.tweet_id = t.tweet_id) AS like_count,
                (SELECT COUNT(*) FROM retweets r WHERE r.tweet_id = t.tweet_id) AS retweet_count,
                (SELECT COUNT(*) FROM comments c WHERE c.tweet_id = t.tweet_id) AS comments_count,
                t.created_at
            FROM tweets t
            JOIN users u ON t.user_id = u.user_id
            WHERE u.user_id = $1
            ORDER BY t.created_at DESC
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('User interactions getirilemedi:', err.message);
        res.status(500).json({ error: 'User interactions getirilemedi' });
    }
});

// 19. Retweet yap
app.post('/api/tweets/:id/retweet', async (req, res) => {
    const tweetId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id zorunludur' });
    }

    try {
        // Retweet kontrolü
        const existingRetweet = await pool.query(
            'SELECT * FROM retweets WHERE user_id = $1 AND tweet_id = $2',
            [user_id, tweetId]
        );

        if (existingRetweet.rows.length > 0) {
            // Retweet'i kaldır
            await pool.query(
                'DELETE FROM retweets WHERE user_id = $1 AND tweet_id = $2',
                [user_id, tweetId]
            );
            await pool.query(
                'UPDATE tweets SET retweet_count = retweet_count - 1 WHERE tweet_id = $1',
                [tweetId]
            );
            res.json({ message: 'Retweet kaldırıldı', retweeted: false });
        } else {
            // Retweet ekle
            await pool.query(
                'INSERT INTO retweets (user_id, tweet_id) VALUES ($1, $2)',
                [user_id, tweetId]
            );
            await pool.query(
                'UPDATE tweets SET retweet_count = retweet_count + 1 WHERE tweet_id = $1',
                [tweetId]
            );
            res.json({ message: 'Tweet retweetlendi', retweeted: true });
        }
    } catch (err) {
        console.error('Retweet işlemi başarısız:', err.message);
        res.status(500).json({ error: 'Retweet işlemi başarısız' });
    }
});

// 20. Kullanıcı takip et / takibi bırak
app.post('/api/users/:id/follow', async (req, res) => {
    const followingId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id zorunludur' });
    }

    if (user_id == followingId) {
        return res.status(400).json({ error: 'Kendinizi takip edemezsiniz' });
    }

    try {
        // Takip kontrolü
        const existingFollow = await pool.query(
            'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
            [user_id, followingId]
        );

        if (existingFollow.rows.length > 0) {
            // Takibi bırak
            await pool.query(
                'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
                [user_id, followingId]
            );
            res.json({ message: 'Takip bırakıldı', following: false });
        } else {
            // Takip et
            await pool.query(
                'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
                [user_id, followingId]
            );
            res.json({ message: 'Kullanıcı takip edildi', following: true });
        }
    } catch (err) {
        console.error('Takip işlemi başarısız:', err.message);
        res.status(500).json({ error: 'Takip işlemi başarısız' });
    }
});

// 21. Kullanıcının takipçileri
app.get('/api/users/:id/followers', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query(`
            SELECT 
                u.user_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.bio,
                u.is_verified,
                f.created_at AS followed_at
            FROM follows f
            JOIN users u ON f.follower_id = u.user_id
            WHERE f.following_id = $1
            ORDER BY f.created_at DESC
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Followers getirilemedi:', err.message);
        res.status(500).json({ error: 'Followers getirilemedi' });
    }
});

// 22. Kullanıcının takip ettikleri
app.get('/api/users/:id/following', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query(`
            SELECT 
                u.user_id,
                u.username,
                u.display_name,
                u.profile_image,
                u.bio,
                u.is_verified,
                f.created_at AS followed_at
            FROM follows f
            JOIN users u ON f.following_id = u.user_id
            WHERE f.follower_id = $1
            ORDER BY f.created_at DESC
        `, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Following getirilemedi:', err.message);
        res.status(500).json({ error: 'Following getirilemedi' });
    }
});

// 23. Tweet sil
app.delete('/api/tweets/:id', async (req, res) => {
    const tweetId = req.params.id;
    const { user_id } = req.body;

    try {
        // Tweet sahibi kontrolü
        const tweet = await pool.query(
            'SELECT user_id FROM tweets WHERE tweet_id = $1',
            [tweetId]
        );

        if (tweet.rows.length === 0) {
            return res.status(404).json({ error: 'Tweet bulunamadı' });
        }

        if (tweet.rows[0].user_id != user_id) {
            return res.status(403).json({ error: 'Bu tweeti silme yetkiniz yok' });
        }

        await pool.query('DELETE FROM tweets WHERE tweet_id = $1', [tweetId]);
        res.json({ message: 'Tweet silindi' });
    } catch (err) {
        console.error('Tweet silinemedi:', err.message);
        res.status(500).json({ error: 'Tweet silinemedi' });
    }
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║     TWITTER WEB UYGULAMASI BAŞLATILDI      ║
╠════════════════════════════════════════════╣
║  Sunucu: http://localhost:${PORT}              ║
║  API:    http://localhost:${PORT}/api          ║
╚════════════════════════════════════════════╝
    `);
});

