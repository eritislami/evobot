<template>
<div>
    <SongTable/>
</div>
</template>

<script>
import SongTable from './SongTable'
import Login from './Login'

export default {
    name: 'Home',
    components: {
        SongTable,
        Login
    }
}
</script>