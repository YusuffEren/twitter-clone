# 🐦 Twitter Veritabanı Projesi

<div align="center">

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Twitter benzeri bir sosyal medya uygulaması için tasarlanmış kapsamlı veritabanı projesi.**

[Özellikler](#-özellikler) • [Kurulum](#-kurulum) • [Veritabanı Şeması](#-veritabanı-şeması) • [API](#-api-endpoints) • [Sorgular](#-örnek-sorgular)

</div>

---

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Veritabanı Şeması](#-veritabanı-şeması)
- [API Endpoints](#-api-endpoints)
- [Örnek Sorgular](#-örnek-sorgular)
- [Ekran Görüntüleri](#-ekran-görüntüleri)

---

## 📖 Proje Hakkında

Bu proje, Twitter benzeri bir sosyal medya platformunun veritabanı tasarımını ve tam işlevsel bir web uygulamasını içermektedir. Proje, modern veritabanı tasarım ilkelerini kullanarak kullanıcı yönetimi, tweet paylaşımı, beğeni sistemi, takip mekanizması ve hashtag özellikleri gibi temel sosyal medya fonksiyonlarını desteklemektedir.

### 🎯 Proje Kapsamı

- **8 adet veritabanı tablosu** tasarımı
- **10+ adet örnek SQL sorgusu** (JOIN, Subquery, Aggregation)
- **RESTful API** ile tam işlevsel backend
- **Responsive web arayüzü** ile Twitter benzeri deneyim
- **ER diyagramı** ile görsel veritabanı dokümantasyonu

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 👤 **Kullanıcı Yönetimi** | Kayıt, profil bilgileri, doğrulanmış hesaplar |
| 📝 **Tweet Sistemi** | Tweet oluşturma, görüntüleme, 280 karakter limiti |
| ❤️ **Beğeni Sistemi** | Tweet beğenme/beğeni kaldırma |
| 🔄 **Retweet Desteği** | İçerik paylaşım mekanizması |
| 👥 **Takip Sistemi** | Kullanıcı takip etme, takipçi listesi |
| 💬 **Yorum Sistemi** | Tweetlere yorum yapabilme |
| #️⃣ **Hashtag Desteği** | Otomatik hashtag çıkarma ve trend analizi |
| 📊 **İstatistikler** | Kullanıcı ve tweet istatistikleri |

---

## 🛠 Teknolojiler

### Veritabanı
- **PostgreSQL 15+** - Güçlü ve güvenilir ilişkisel veritabanı

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **pg** - PostgreSQL client

### Frontend
- **HTML5 / CSS3** - Modern, responsive tasarım
- **Vanilla JavaScript** - Dinamik arayüz

---

## 🚀 Kurulum

### Gereksinimler

- PostgreSQL 12 veya üzeri
- Node.js 14 veya üzeri
- npm veya yarn

### 1️⃣ Veritabanı Kurulumu

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanı oluştur (isteğe bağlı)
CREATE DATABASE twitter_db;
\c twitter_db

# Şemayı yükle
\i twitter_schema.sql

# Örnek verileri yükle
\i twitter_data.sql
```

### 2️⃣ Web Uygulaması Kurulumu

```bash
# Proje klasörüne gir
cd twitter-app

# Bağımlılıkları yükle
npm install

# Sunucuyu başlat
npm start
```

### 3️⃣ Veritabanı Bağlantısı

`twitter-app/server.js` dosyasında veritabanı ayarlarını düzenleyin:

```javascript
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',  // veya twitter_db
    user: 'postgres',
    password: 'your_password'
});
```

### 4️⃣ Uygulamayı Çalıştır

```bash
npm start
# Sunucu: http://localhost:3000
```

---

## 📊 Veritabanı Şeması

### ER Diyagramı

<div align="center">
<img src="twitter_er_diagram.png" alt="ER Diyagramı" width="800">
</div>

### Tablolar

| Tablo | Açıklama | Sütunlar |
|-------|----------|----------|
| `users` | Kullanıcı bilgileri | user_id, username, email, display_name, bio, is_verified |
| `tweets` | Tweet içerikleri | tweet_id, user_id, content, like_count, retweet_count |
| `likes` | Beğeni kayıtları | like_id, user_id, tweet_id |
| `retweets` | Retweet kayıtları | retweet_id, user_id, tweet_id |
| `follows` | Takip ilişkileri | follow_id, follower_id, following_id |
| `comments` | Yorum kayıtları | comment_id, user_id, tweet_id, content |
| `hashtags` | Hashtag tanımları | hashtag_id, tag_name |
| `tweet_hashtags` | Tweet-Hashtag ilişkisi | tweet_id, hashtag_id |

### İlişkiler

- **Users → Tweets**: Bir kullanıcı birçok tweet atabilir (1:N)
- **Users → Follows**: Kullanıcılar birbirini takip edebilir (N:N)
- **Tweets → Likes**: Bir tweet birçok beğeni alabilir (1:N)
- **Tweets → Comments**: Bir tweet birçok yorum alabilir (1:N)
- **Tweets ↔ Hashtags**: Çoka-çok ilişki, ara tablo ile (N:N)

---

## 🔌 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/users` | Tüm kullanıcıları listele |
| `GET` | `/api/users/:id/stats` | Kullanıcı istatistikleri |
| `GET` | `/api/tweets` | Tüm tweetleri listele (timeline) |
| `POST` | `/api/tweets` | Yeni tweet oluştur |
| `GET` | `/api/tweets/popular` | Popüler tweetler |
| `POST` | `/api/tweets/:id/like` | Tweet beğen/beğeni kaldır |
| `GET` | `/api/tweets/:id/comments` | Tweet yorumlarını getir |
| `POST` | `/api/tweets/:id/comments` | Tweete yorum ekle |
| `GET` | `/api/hashtags` | Trend hashtag'ler |
| `GET` | `/api/hashtags/:tag/tweets` | Hashtag'e göre tweetler |

### Örnek API Kullanımı

```bash
# Tüm tweetleri getir
curl http://localhost:3000/api/tweets

# Yeni tweet oluştur
curl -X POST http://localhost:3000/api/tweets \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "content": "Merhaba Twitter! #ilktweet"}'

# Tweet beğen
curl -X POST http://localhost:3000/api/tweets/1/like \
  -H "Content-Type: application/json" \
  -d '{"user_id": 2}'
```

---

## 📝 Örnek Sorgular

### 1. En Çok Takipçisi Olan Kullanıcılar
```sql
SELECT u.username, u.display_name, COUNT(f.follower_id) AS takipci_sayisi
FROM users u
LEFT JOIN follows f ON u.user_id = f.following_id
GROUP BY u.user_id
ORDER BY takipci_sayisi DESC
LIMIT 10;
```

### 2. En Popüler Tweetler
```sql
SELECT t.content, u.username, t.like_count, t.retweet_count
FROM tweets t
JOIN users u ON t.user_id = u.user_id
ORDER BY t.like_count DESC
LIMIT 10;
```

### 3. Trending Hashtag'ler
```sql
SELECT h.tag_name, COUNT(th.tweet_id) AS kullanim_sayisi
FROM hashtags h
JOIN tweet_hashtags th ON h.hashtag_id = th.hashtag_id
GROUP BY h.hashtag_id
ORDER BY kullanim_sayisi DESC
LIMIT 10;
```

### 4. Karşılıklı Takipleşenler
```sql
SELECT u1.username AS kullanici1, u2.username AS kullanici2
FROM follows f1
JOIN follows f2 ON f1.follower_id = f2.following_id 
    AND f1.following_id = f2.follower_id
JOIN users u1 ON f1.follower_id = u1.user_id
JOIN users u2 ON f1.following_id = u2.user_id
WHERE f1.follower_id < f1.following_id;
```

### 5. Kullanıcı Timeline
```sql
SELECT t.content, u.username, t.created_at
FROM tweets t
JOIN users u ON t.user_id = u.user_id
WHERE t.user_id IN (
    SELECT following_id FROM follows WHERE follower_id = 1
)
ORDER BY t.created_at DESC
LIMIT 20;
```

> 📄 Tüm sorgular için `twitter_queries.sql` dosyasını inceleyin.

---

## 📁 Dosya Yapısı

```
sql-ödev/
├── 📄 README.md              # Bu dosya
├── 📄 twitter_schema.sql     # Veritabanı şeması
├── 📄 twitter_data.sql       # Örnek veriler
├── 📄 twitter_queries.sql    # SQL sorguları
├── 🖼️ twitter_er_diagram.png # ER diyagramı
└── 📁 twitter-app/           # Web uygulaması
    ├── 📄 server.js          # Express.js sunucu
    ├── 📄 package.json       # Node.js bağımlılıkları
    └── 📁 public/            # Frontend dosyaları
        ├── index.html
        ├── style.css
        └── script.js
```

---

## 📸 Ekran Görüntüleri

### Web Arayüzü
Uygulama, Twitter'ın gerçek arayüzüne benzer modern bir tasarıma sahiptir:
- 🌙 **Sidebar navigasyonu**
- 📰 **Ana timeline görünümü**  
- 📊 **Trend hashtag'ler paneli**
- 👤 **Kullanıcı profil kartları**


---

## 📜 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

</div>
