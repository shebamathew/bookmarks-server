const bookmarks = [{ 
    id: 1,
    title: 'Github',
    url: 'http://www.github.com',
    rating: '4',
    desc: 'brings together the world\'s largest community of developers.'
  }]; 

  const lists = [{
    id: 1, 
    header: "Bookmark List One", 
    bookmarkIds: [1]
  }]

  module.exports = { bookmarks, lists}