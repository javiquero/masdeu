<template>
    <div class="reports-list">
        <div v-if="list.length">
            <div v-for="report in list" :key="report.id" class="post" @click="viewReport(report)">
                <span>{{ formatDate(report.createdOn) }}</span>
                <p>({{ formatLongDate(report.createdOn) }}) - {{ trimLength(report.comment) }}</p>
            </div>
        </div>
        <div v-else>
            <p class="no-results"> {{ $t("No_reports") }}</p>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    import eventBus from '@/event-bus.js'
    import {
        mapState
    } from 'vuex'

    export default {
        props: ['project'],
        data() {
            return {
                list: []
            }
        },
        watch: {
            reports(val) {
                this.refreshList();
            },
            project(val) {
                this.refreshList();
            }
        },
        computed: {
            ...mapState(['reports']),

        },
        methods: {
            viewReport(report) {
                eventBus.$emit('report:open', {
                    report: report,
                    project: this.project
                });
            },
            refreshList() {
                if (this.reports && this.project) {
                    this.list = this.reports.filter(i => {
                        return i.idProject == this.project.id
                    });
                } else {
                    this.list = [];
                }
            },
            formatDate(val) {
                if (!val) return '-';
                return moment(val.toDate()).locale(this.$i18n.locale).fromNow()
            },
            formatLongDate(val){
                if (!val) return '-';
                return moment(val.toDate()).locale(this.$i18n.locale).format('LL');
            },
            trimLength(val) {
                if (val.length < 50)  return val;
                return `${val.substring(0, 50)}...`
            }
        },
        mounted() {
            this.refreshList();
        }
    }

</script>

<style lang="scss" scoped>
$light: #F5F8FA;
$dark: #34495E;
$white: #fff;
    .reports-list {
        .post {
             @media only screen and (max-width: 600px) {
                 padding:10px !important;
             }
            border: 1px solid #e6ecf0;
            border-bottom: 0;
            font-size: 14px;
            padding: 1.5rem;
            background: $white;
            text-align: justify;

            &:hover {
                background: #f5f8fa;
            }

            &:last-of-type {
                border-bottom: 1px solid $light;
            }

            h5 {
                margin: 0 0 0.5rem;
            }

            span {
                display: block;
                font-style: italic;
                font-size: 12px;
                margin-bottom: 0.5rem;
                color: darken($light, 25%);
            }

            p {
                margin: 0;
            }

            ul {
                list-style: none;
                margin: 1rem 0 0;
                padding: 0;

                li {
                    display: inline-block;
                    margin-right: 1rem;
                    font-size: 12px;
                }
            }
        }

        .no-results {
            border: 1px solid #e6ecf0;
            background: $white;
            text-align: center;
            padding: 100px 1rem;
        }
    }

</style>
