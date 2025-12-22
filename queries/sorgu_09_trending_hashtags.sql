-- ============================================
-- QUERY 9: Trending Hashtags
-- Description: Lists the most used hashtags.
-- Used for tracking trending topics.
-- ============================================
SELECT 
    h.hashtag_id,
    h.tag_name,
    COUNT(th.tweet_id) AS kullanim_sayisi,
    MAX(t.created_at) AS son_kullanim_tarihi
FROM hashtags h
JOIN tweet_hashtags th ON h.hashtag_id = th.hashtag_id
JOIN tweets t ON th.tweet_id = t.tweet_id
GROUP BY h.hashtag_id, h.tag_name
ORDER BY kullanim_sayisi DESC
LIMIT 10;
