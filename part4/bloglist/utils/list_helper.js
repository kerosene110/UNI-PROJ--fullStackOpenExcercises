const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (!blogs) {
        return 0
    }
    return blogs.reduce((prevSum, blog) => prevSum + blog.likes, 0)
}

module.exports = {
    dummy, totalLikes
}