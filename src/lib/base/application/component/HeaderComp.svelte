<script lang="ts">

import '@/scss/components/loader/loader_general.scss'

//const [title, setTitle] = useState("HEADER")
let display = "none"

const style_loader1 = {
    display : "display"
}

export const mostrarLoader = () => {
    display="block"
}

export const ocultarLoader = () => {
    display="none"
}

</script>

<div id="div_header">
    
    <h5 style="text-align: center">
        Metricas Auto (H)
    </h5>
    
    <div id="div_loader" 
        style="style_loader1"
        class="loader_general">        
    </div>

</div>

<style>

</style>