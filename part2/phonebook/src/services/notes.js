import axios from 'axios'
const baseUrl = 'http://localhost:3001'

const getAll = () => {
    return axios.get(`${baseUrl}/persons`)
        .then(response => response.data)
}

export default { getAll }