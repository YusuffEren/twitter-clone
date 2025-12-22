-- ============================================
-- QUERY 3: Tweets Containing a Specific Hashtag
-- Description: Used for trend analysis.
-- Example: Tweets containing the #technology hashtag
-- ============================================
SELECT 
    t.tweet_id,
    u.username,
    t.content,
    h.tag_name AS hashtag,
    t.created_at
FROM tweets t
JOIN users u ON t.user_id = u.user_id
JOIN tweet_hashtags th ON t.tweet_id = th.tweet_id
JOIN hashtags h ON th.hashtag_id = h.hashtag_id
WHERE h.tag_name = 'teknoloji'
ORDER BY t.created_at DESC;
