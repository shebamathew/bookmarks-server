module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    // API_TOKEN: process.env.API_TOKEN || '48754250-538d-490e-a6d6-1a215b84cc6b',
    DB_URL: process.env.DB_URL || 'postgresql://dunder-mifflin@localhost/bookmarks'
  }