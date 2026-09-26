const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (!blogs) {
        return 0
    }
    return blogs.reduce((prevSum, blog) => prevSum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }

    const result = blogs.reduce((maxLikeBlog, blog) => {
        return (blog.likes > maxLikeBlog.likes) ? blog : maxLikeBlog
    }, { likes: -1 })
    return result.likes === -1 ? null : result
}

const mostBlogs = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }
    let _ = require('lodash')
    const counter = _.countBy(blogs, 'author')
    const result = _.maxBy(_.keys(counter), (author) => counter[author])
    return { author: result, blogs: counter[result] }
}

const mostLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }

    let _ = require('lodash')
    const result = _.chain(blogs).groupBy('author')
        .map((authorBlogs, author) => ({
            author: author,
            likes: _.sumBy(authorBlogs, 'likes')
        }))
        .maxBy('likes')
        .value()

    return result
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}