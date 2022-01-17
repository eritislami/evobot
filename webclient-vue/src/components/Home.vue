<template>
<div>
    <SongTable/>
    <BrowserPlugins/>
</div>
</template>

<script>
import SongTable from './SongTable'
import BrowserPlugins from './BrowserPlugins.vue'

export default {
    name: 'Home',
    components: {
        SongTable, BrowserPlugins
    }
}
</script>