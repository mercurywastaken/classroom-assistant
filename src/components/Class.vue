<template>
    <div class="col-6 p-1">
        <div class="card p-3" style="cursor: pointer;">
            <p>{{this.className}}</p>
            <p>{{this.classCode}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ClassCard',
    props: {
        classData: Object
    },
    data() {
        return {
            className: '',
            classCode: ''
        }
    },
    beforeMount() {
        this.className = this.classData.name
        this.classCode = this.classData.code
    }
}
</script>

<style>

</style>