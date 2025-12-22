-- ============================================
-- TWITTER VERİTABANI ŞEMASI
-- PostgreSQL için tasarlanmıştır
-- ============================================

-- Mevcut tabloları temizle (varsa)
DROP TABLE IF EXISTS tweet_hashtags CASCADE;
DROP TABLE IF EXISTS hashtags CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS retweets CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS tweets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS TABLOSU (Kullanıcılar)
-- ============================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);

-- ============================================
-- 2. TWEETS TABLOSU (Tweetler)
-- ============================================
CREATE TABLE tweets (
    tweet_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    like_count INTEGER DEFAULT 0,
    retweet_count INTEGER DEFAULT 0,
    CONSTRAINT fk_tweets_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- ============================================
-- 3. LIKES TABLOSU (Beğeniler)
-- ============================================
CREATE TABLE likes (
    like_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tweet_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_likes_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_likes_tweet
        FOREIGN KEY (tweet_id)
        REFERENCES tweets(tweet_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_user_tweet_like
        UNIQUE (user_id, tweet_id)
);

-- ============================================
-- 4. RETWEETS TABLOSU (Retweetler)
-- ============================================
CREATE TABLE retweets (
    retweet_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tweet_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_retweets_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_retweets_tweet
        FOREIGN KEY (tweet_id)
        REFERENCES tweets(tweet_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_user_tweet_retweet
        UNIQUE (user_id, tweet_id)
);

-- ============================================
-- 5. FOLLOWS TABLOSU (Takip İlişkileri)
-- ============================================
CREATE TABLE follows (
    follow_id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_follows_follower
        FOREIGN KEY (follower_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_follows_following
        FOREIGN KEY (following_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_follow_relation
        UNIQUE (follower_id, following_id),
    CONSTRAINT no_self_follow
        CHECK (follower_id != following_id)
);

-- ============================================
-- 6. COMMENTS TABLOSU (Yorumlar/Cevaplar)
-- ============================================
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tweet_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_comments_tweet
        FOREIGN KEY (tweet_id)
        REFERENCES tweets(tweet_id)
        ON DELETE CASCADE
);

-- ============================================
-- 7. HASHTAGS TABLOSU (Etiketler)
-- ============================================
CREATE TABLE hashtags (
    hashtag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(100) UNIQUE NOT NULL
);

-- ============================================
-- 8. TWEET_HASHTAGS TABLOSU (Tweet-Hashtag İlişki Tablosu)
-- ============================================
CREATE TABLE tweet_hashtags (
    tweet_id INTEGER NOT NULL,
    hashtag_id INTEGER NOT NULL,
    PRIMARY KEY (tweet_id, hashtag_id),
    CONSTRAINT fk_tweet_hashtags_tweet
        FOREIGN KEY (tweet_id)
        REFERENCES tweets(tweet_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tweet_hashtags_hashtag
        FOREIGN KEY (hashtag_id)
        REFERENCES hashtags(hashtag_id)
        ON DELETE CASCADE
);

-- ============================================
-- İNDEKSLER (Performans için)
-- ============================================
CREATE INDEX idx_tweets_user_id ON tweets(user_id);
CREATE INDEX idx_tweets_created_at ON tweets(created_at);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_tweet_id ON likes(tweet_id);
CREATE INDEX idx_retweets_user_id ON retweets(user_id);
CREATE INDEX idx_retweets_tweet_id ON retweets(tweet_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_comments_tweet_id ON comments(tweet_id);
CREATE INDEX idx_hashtags_tag_name ON hashtags(tag_name);

