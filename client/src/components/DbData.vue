<template>
<div>
    <Row class="expand-row">
        <Table border :columns="expndCol" :data="expndDta" size="small"></Table>
    </Row>
</div>
</template>
<script>
/* eslint-disable */
export default {
    props: {
        row: Object
    },
    data () {
        return {
            expndCol: [
                {
                    title: 'Database Name', 
                    key: 'dbname'
                },
                {
                    title: 'Username',
                    key: 'uname'
                }
            ],
            expndDta: [
                {
                    dbname: this.row.dbname,
                    uname: this.row.username
                }
            ]
        }
    }
}
</script>
<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>