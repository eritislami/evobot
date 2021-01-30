import axios from 'axios'

export async function authorize() {
    // TODO: Configure to only use proxyUrl locally (not in production)
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const url = 'https://discord.com/api/oauth2/authorize?client_id=701591092730134528&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify'
    let authorizeResult = await axios.get(proxyUrl + url)
    console.info(`Auth: ${authorizeResult.json()}`)
}
