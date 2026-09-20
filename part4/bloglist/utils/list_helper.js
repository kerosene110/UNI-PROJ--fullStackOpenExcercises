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

module.exports = {
    dummy, totalLikes, favoriteBlog
}