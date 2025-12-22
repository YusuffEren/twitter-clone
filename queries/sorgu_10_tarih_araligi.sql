-- ============================================
-- QUERY 10: Tweets in a Specific Date Range
-- Description: Performs time-based filtering.
-- Example: Tweets within January 2024
-- ============================================
SELECT 
    t.tweet_id,
    u.username,
    u.display_name,
    t.content,
    t.like_count,
    t.retweet_count,
    t.created_at
FROM tweets t
JOIN users u ON t.user_id = u.user_id
WHERE t.created_at BETWEEN '2024-01-01 00:00:00' AND '2024-01-31 23:59:59'
ORDER BY t.created_at DESC;
