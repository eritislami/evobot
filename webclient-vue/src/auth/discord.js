import axios from 'axios'
import qs from 'qs'
import {globalStore} from '../main'
import {discord as discordConfig} from '../../auth_config'
import store from '../store'

function resetDiscordValues() {
    localStorage.removeItem('discord_access_token')
    localStorage.removeItem('discord_refresh_token')
    localStorage.removeItem('discord_token_expires_at')
    localStorage.removeItem('discord_user')
    store.commit('updateUser')
}

function isTokenValid() {
    // TODO: error handling
    try {
        const token = JSON.parse(localStorage.getItem('discord_access_token'))
        const expires = parseInt(localStorage.getItem('discord_token_expires_at'))
        if (token && expires) {
            return expires < Date.now()
        }
    } catch (err) {
        console.error("Failed to determine if existing token is valid", err)
    }
    return false
}

export async function login(accessCode) {
    resetDiscordValues()

    await retrieveAccessToken(accessCode)
}

export function logout() {
    resetDiscordValues()
}

async function retrieveAccessToken(code) {
    const url = 'https://discord.com/api/oauth2/token'
    const data = discordConfig
    if (code) {
        data.code = code
    } else {
        data.refresh_token = localStorage.get('discord_refresh_token')
        data.grant_type = 'refresh_token'
    }

    let tokenResult = await axios.post(url, qs.stringify(data), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    console.log(tokenResult)

    localStorage.setItem('discord_access_token', tokenResult.data.access_token)
    localStorage.setItem('discord_refresh_token', tokenResult.data.refresh_token)
    localStorage.setItem('discord_token_expires_at', Date.now() + tokenResult.data.expires_in)

    let userinfo = await getUserInfo()
    localStorage.setItem('discord_user', JSON.stringify(userinfo))
    store.commit('updateUser')
    
    return tokenResult
}

export async function getUserInfo() {
    // TODO: Check for session expiration
    const url = 'https://discord.com/api/users/@me'

    let result = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('discord_access_token')}`
        }
    })
    console.info(`User: ${JSON.stringify(result.data)}`)
    return result.data
}
