# Twitter Clone - Web Uygulaması

PostgreSQL veritabanı ödevi için geliştirilmiş Twitter benzeri web uygulaması.

## Teknolojiler

- **Backend:** Node.js + Express.js
- **Veritabanı:** PostgreSQL
- **Frontend:** HTML + CSS + Vanilla JavaScript
- **API:** REST API

## Kurulum

### 1. Gereksinimler

- Node.js (v14 veya üzeri)
- PostgreSQL (v12 veya üzeri)

### 2. Veritabanı Kurulumu

Öncelikle PostgreSQL'de veritabanını oluşturun:

```sql
CREATE DATABASE twitter_db;
```

Ardından şema ve verileri yükleyin:

```bash
# Ana klasörden
psql -U postgres -d twitter_db -f twitter_schema.sql
psql -U postgres -d twitter_db -f twitter_data.sql
```

### 3. Uygulama Kurulumu

```bash
# twitter-app klasörüne girin
cd twitter-app

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun
# Windows:
copy .env.example .env
# Linux/Mac:
cp .env.example .env

# .env dosyasını düzenleyin ve veritabanı bilgilerinizi girin
```

### 4. Uygulamayı Çalıştırma

```bash
npm start
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Özellikler

- ✅ Kullanıcıları listeleme ve istatistiklerini görüntüleme
- ✅ Tweet akışını (timeline) görüntüleme
- ✅ Yeni tweet ekleme
- ✅ Tweet beğenme/beğeniyi kaldırma
- ✅ Hashtag'lere göre filtreleme
- ✅ Trending hashtag'leri görüntüleme
- ✅ Popüler tweetleri görüntüleme
- ✅ Yorumları görüntüleme ve yorum yapma

## API Endpoint'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/users | Tüm kullanıcıları getir |
| GET | /api/tweets | Tüm tweetleri getir |
| POST | /api/tweets | Yeni tweet ekle |
| POST | /api/tweets/:id/like | Tweet beğen |
| GET | /api/hashtags | Trending hashtag'ler |
| GET | /api/hashtags/:tag/tweets | Belirli hashtag'in tweetleri |
| GET | /api/users/:id/stats | Kullanıcı istatistikleri |
| GET | /api/tweets/:id/comments | Tweet'in yorumları |
| POST | /api/tweets/:id/comments | Yorum ekle |
| GET | /api/tweets/popular | Popüler tweetler |

## Ekran Görüntüleri

Uygulamayı çalıştırdıktan sonra:

1. **Ana Sayfa:** Tweet akışı ve yeni tweet oluşturma
2. **Kullanıcılar:** Tüm kullanıcılar ve istatistikleri
3. **Trendler:** En popüler hashtag'ler
4. **Popüler:** En çok etkileşim alan tweetler

## Proje Yapısı

```
twitter-app/
├── server.js          # Express sunucu ve API endpoint'leri
├── package.json       # Node.js bağımlılıkları
├── README.md          # Bu dosya
└── public/
    ├── index.html     # Ana sayfa
    ├── style.css      # CSS stilleri
    └── app.js         # Frontend JavaScript
```

## Geliştirici

Bu proje PostgreSQL veritabanı ödevi kapsamında geliştirilmiştir.

